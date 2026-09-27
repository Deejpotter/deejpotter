/**
 * quote-actions.ts — Carries out an order step: status, Stripe, then email
 *
 * The admin buttons and the Stripe webhook both end up here, so a step always
 * has the same side effects no matter what triggered it. For example "paid"
 * always switches off the payment link and emails both the customer and Deej,
 * whether Stripe reported it or Deej marked a cash payment by hand.
 *
 * Order matters: anything that can fail (checking the step is allowed,
 * creating the Stripe link) happens before the database changes, so a failed
 * step leaves the quote as it was. Emails go last and never undo a step.
 */

import { getQuote, updateQuote } from "./db-quotes";
import type { QuoteStatusHistoryEntry } from "./db-schemas";
import { notifyAdminPaymentReceived, notifyQuoteAction } from "./email";
import { canApplyAction, nextStatus, trackingUrl, type DeliveryMethod, type QuoteAction } from "./quote-workflow";
import { createQuotePaymentLink, deactivatePaymentLink } from "./stripe-payments";

export interface QuoteActionInput {
  /** send_quote: the confirmed job price in AUD. */
  price?: number;
  /** send_quote: shipping/delivery in AUD (0 or null for pickup). */
  shippingCost?: number | null;
  shippingLabel?: string | null;
  turnaround?: string | null;
  /** ship: carrier id (e.g. "auspost") and tracking number. */
  carrier?: string | null;
  trackingNumber?: string | null;
  /** decline/cancel: optional reason passed on to the customer. */
  reason?: string | null;
  /** mark_paid from Stripe: what was actually charged, and the session. */
  amountPaid?: number | null;
  stripeSessionId?: string | null;
}

export class QuoteActionError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

type QuoteDoc = NonNullable<Awaited<ReturnType<typeof getQuote>>>;

export async function performQuoteAction(
  quoteNumber: number,
  action: QuoteAction,
  input: QuoteActionInput = {},
  by: QuoteStatusHistoryEntry["by"] = "admin",
): Promise<QuoteDoc> {
  const quote = await getQuote(quoteNumber);
  if (!quote) throw new QuoteActionError("Quote not found", 404);
  if (!canApplyAction(quote.status, action)) {
    throw new QuoteActionError(`Can't ${action.replace("_", " ")} a quote that is ${quote.status.replace("_", " ")}.`);
  }

  const deliveryMethod = (quote.delivery?.method ?? "pickup") as DeliveryMethod;
  const oldLinkId = quote.payment?.paymentLinkId ?? null;
  const patch: Parameters<typeof updateQuote>[1] = {
    status: nextStatus(action),
    changedBy: by,
    historyNote: input.reason ?? undefined,
  };

  switch (action) {
    case "send_quote": {
      const price = Number(input.price);
      if (!(price > 0)) throw new QuoteActionError("Enter a price above $0.");
      // Pickup has no shipping; posted orders need an amount so the link is right.
      const shippingCost = deliveryMethod === "pickup" ? 0 : Number(input.shippingCost ?? quote.delivery?.cost ?? 0);
      if (deliveryMethod === "shipped" && !(shippingCost > 0)) {
        throw new QuoteActionError("Enter the shipping cost for a posted order.");
      }
      const shippingLabel = input.shippingLabel || (deliveryMethod === "local_delivery" ? "Local delivery" : "Shipping");
      // Made first: if Stripe fails, nothing has changed and Deej can retry.
      const link = await createQuotePaymentLink({ quoteNumber, price, shippingCost, shippingLabel });
      Object.assign(patch, {
        quotedPrice: price,
        turnaroundEstimate: input.turnaround ?? quote.turnaroundEstimate ?? null,
        paymentLinkId: link.id,
        paymentLinkUrl: link.url,
        delivery: { cost: shippingCost, estimate: shippingLabel },
      });
      break;
    }
    case "mark_paid":
      Object.assign(patch, {
        paidAt: new Date().toISOString(),
        amountPaid: input.amountPaid ?? totalFor(quote),
        stripeSessionId: input.stripeSessionId ?? null,
      });
      break;
    case "ship":
      if (!input.trackingNumber?.trim()) throw new QuoteActionError("Enter the tracking number.");
      patch.delivery = {
        carrier: input.carrier || "auspost",
        trackingNumber: input.trackingNumber.trim(),
        shippedAt: new Date().toISOString(),
      };
      break;
  }

  const updated = await updateQuote(quoteNumber, patch);
  if (!updated) throw new QuoteActionError("Quote not found", 404);

  // A link that can no longer be paid should stop working straight away:
  // replaced by a new price, paid, or the order is off.
  if (oldLinkId && (action === "send_quote" || action === "mark_paid" || action === "cancel" || action === "decline")) {
    if (!(action === "send_quote" && oldLinkId === updated.payment?.paymentLinkId)) {
      await deactivatePaymentLink(oldLinkId);
    }
  }

  const name = updated.userName || updated.userEmail;
  const ctx = {
    name,
    quoteNumber,
    price: updated.quotedPrice,
    shippingCost: updated.delivery?.cost ?? null,
    shippingLabel: updated.delivery?.estimate ?? null,
    paymentLinkUrl: updated.payment?.paymentLinkUrl ?? null,
    turnaround: updated.turnaroundEstimate,
    deliveryMethod,
    carrier: updated.delivery?.carrier ?? null,
    trackingNumber: updated.delivery?.trackingNumber ?? null,
    trackingUrl: trackingUrl(updated.delivery?.carrier, updated.delivery?.trackingNumber),
    amountPaid: updated.payment?.amountPaid ?? null,
    reason: input.reason ?? null,
  };
  try {
    await notifyQuoteAction(updated.userEmail, action, ctx);
    if (action === "mark_paid") {
      await notifyAdminPaymentReceived({ quoteNumber, name, amountPaid: ctx.amountPaid });
    }
  } catch (err) {
    console.error(`[quote-actions] Email for ${action} on #${quoteNumber} failed:`, err);
  }

  return updated as QuoteDoc;
}

/** What the customer was asked to pay, for payments marked by hand. */
function totalFor(quote: QuoteDoc): number | null {
  if (quote.quotedPrice == null) return null;
  return Math.round((quote.quotedPrice + (quote.delivery?.cost ?? 0)) * 100) / 100;
}
