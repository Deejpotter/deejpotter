/**
 * quote-workflow.ts — The rules for how a quote moves from request to delivery
 *
 * The admin buttons, the Stripe webhook and the customer pages all need to
 * agree on what each status means and which step can come next. Keeping those
 * rules here (with no database or network code) means a button can't skip
 * payment, the webhook can't "pay" a cancelled quote, and the wording a
 * customer sees is the same on the status page, the account page and emails.
 */

import type { QuoteStatus } from "./db-schemas";

export type DeliveryMethod = "pickup" | "local_delivery" | "shipped";

/**
 * Things that can happen to a quote. Each one is a single admin button, or the
 * Stripe webhook for "mark_paid", so every status change has one clear cause
 * and one matching customer email.
 */
export type QuoteAction =
  | "send_quote"
  | "mark_paid"
  | "start"
  | "ready"
  | "ship"
  | "complete"
  | "decline"
  | "cancel";

/**
 * Which statuses each action is allowed from.
 *
 * - send_quote also works from awaiting_payment so a price can be corrected;
 *   the old payment link is switched off when the new one is made.
 * - "quoted" is only here for quotes created before payment links existed.
 * - mark_paid from "quoted" covers a customer paying in person before the
 *   link is sent; the webhook only ever pays quotes that are awaiting payment.
 * - ship is allowed from ready so a pickup order can still be posted if the
 *   customer changes their mind.
 */
const ALLOWED_FROM: Record<QuoteAction, QuoteStatus[]> = {
  send_quote: ["new", "reviewing", "quoted", "awaiting_payment"],
  mark_paid: ["quoted", "awaiting_payment"],
  start: ["approved"],
  ready: ["approved", "in_progress"],
  ship: ["approved", "in_progress", "ready"],
  complete: ["ready"],
  decline: ["new", "reviewing", "quoted", "awaiting_payment"],
  cancel: ["new", "reviewing", "quoted", "awaiting_payment", "approved", "in_progress", "ready"],
};

/**
 * The status each action leads to. Shipping reuses "ready" (the job is done
 * on our side); the tracking number on the quote is what tells the customer
 * pages to say "Shipped" instead of "Ready for pickup".
 */
const RESULT: Record<QuoteAction, QuoteStatus> = {
  send_quote: "awaiting_payment",
  mark_paid: "approved",
  start: "in_progress",
  ready: "ready",
  ship: "ready",
  complete: "completed",
  decline: "declined",
  cancel: "cancelled",
};

/** Quotes that are finished either way; nothing moves them on automatically. */
export const CLOSED_STATUSES: QuoteStatus[] = ["completed", "declined", "cancelled"];

export function canApplyAction(status: QuoteStatus, action: QuoteAction): boolean {
  return ALLOWED_FROM[action].includes(status);
}

export function nextStatus(action: QuoteAction): QuoteStatus {
  return RESULT[action];
}

/**
 * The buttons the admin page should offer for a quote. "mark_paid" is left
 * out while a Stripe link is waiting, because the webhook does that step and
 * a second manual "paid" would send the customer a duplicate receipt.
 */
export function adminActionsFor(
  status: QuoteStatus,
  opts: { deliveryMethod: DeliveryMethod; hasPaymentLink: boolean },
): QuoteAction[] {
  const order: QuoteAction[] = ["send_quote", "mark_paid", "start", "ready", "ship", "complete", "decline", "cancel"];
  return order.filter((action) => {
    if (!canApplyAction(status, action)) return false;
    if (action === "mark_paid" && opts.hasPaymentLink) return false;
    // Posted orders go out with a tracking number; local ones are "ready".
    if (action === "ready" && opts.deliveryMethod === "shipped") return false;
    if (action === "ship" && opts.deliveryMethod !== "shipped" && status !== "ready") return false;
    return true;
  });
}

/** Button text for the admin page, written as what the click will do. */
export const ACTION_LABELS: Record<QuoteAction, string> = {
  send_quote: "Send quote + payment link",
  mark_paid: "Mark paid (paid another way)",
  start: "Start job",
  ready: "Mark ready",
  ship: "Ship",
  complete: "Complete",
  decline: "Decline",
  cancel: "Cancel",
};

/**
 * Customer-facing wording for a status. It depends on delivery because "ready"
 * means something different to someone collecting in Frankston than to someone
 * waiting for a parcel.
 */
export function customerStatusLabel(
  status: QuoteStatus,
  opts: { deliveryMethod?: DeliveryMethod; shipped?: boolean } = {},
): string {
  switch (status) {
    case "new":
      return "Received";
    case "reviewing":
      return "Being reviewed";
    case "quoted":
      return "Quote ready";
    case "awaiting_payment":
      return "Quote sent, waiting for payment";
    case "approved":
      return "Paid, in the queue";
    case "in_progress":
      return "Being made";
    case "ready":
      if (opts.shipped || opts.deliveryMethod === "shipped") return "Shipped";
      if (opts.deliveryMethod === "local_delivery") return "Out for delivery";
      return "Ready for pickup";
    case "completed":
      return "Completed";
    case "declined":
      return "Declined";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

/**
 * Tracking pages for the carriers Deej uses, so the shipped email and status
 * page can link straight to the parcel. Unknown carriers just show the number.
 */
export function trackingUrl(carrier: string | null | undefined, trackingNumber: string | null | undefined): string | null {
  if (!trackingNumber) return null;
  const number = encodeURIComponent(trackingNumber.trim());
  switch ((carrier || "").toLowerCase()) {
    case "auspost":
    case "australia post":
      return `https://auspost.com.au/mypost/track/details/${number}`;
    case "startrack":
      return `https://startrack.com.au/track/details/${number}`;
    default:
      return null;
  }
}
