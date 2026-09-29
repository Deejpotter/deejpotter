/**
 * stripe-payments.ts — Payment links for quotes
 *
 * Customers don't pay on the site. When Deej confirms a price, the admin
 * "Send quote" action makes a Stripe Payment Link for that exact amount and
 * emails it. A Payment Link (rather than a Checkout Session) is used because
 * it doesn't expire after 24 hours, so the customer can pay whenever they
 * read the email. The quote number rides along as metadata, which Stripe
 * copies onto the checkout session, so the webhook knows which quote was paid.
 */

import type Stripe from "stripe";

const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://deejpotter.com").replace(/\/$/, "");

let client: Stripe | null = null;

/**
 * The Stripe client, created on first use so pages that never take payments
 * don't need the key, and a missing key fails only the payment action (with a
 * clear message) instead of the whole build.
 */
export async function getStripe(): Promise<Stripe> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Payments aren't set up: STRIPE_SECRET_KEY is missing.");
  if (!client) {
    const { default: StripeCtor } = await import("stripe");
    client = new StripeCtor(key);
  }
  return client;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Stripe wants whole cents; rounding here stops $12.345 becoming a failed request. */
function toCents(aud: number): number {
  return Math.round(aud * 100);
}

export interface PaymentLinkInput {
  quoteNumber: number;
  /** Print or job price in AUD, as confirmed by the admin. */
  price: number;
  /** Shipping or delivery in AUD; shown as its own line so the customer sees what they're paying for. */
  shippingCost?: number | null;
  shippingLabel?: string | null;
  description?: string;
}

/**
 * Makes a single-use payment link for a quote.
 *
 * - Separate lines for the job and shipping match the quote email.
 * - `restrictions.completed_sessions.limit = 1` stops a forwarded or reused
 *   link taking a second payment.
 * - After paying, Stripe sends the customer to the site's thank-you page; the
 *   webhook, not that redirect, is what marks the quote paid, because the
 *   redirect can be skipped by closing the tab.
 */
export async function createQuotePaymentLink(input: PaymentLinkInput): Promise<{ id: string; url: string }> {
  if (!(input.price > 0)) throw new Error("The quote needs a price above $0 before a payment link can be made.");
  const stripe = await getStripe();
  const metadata = { quoteNumber: String(input.quoteNumber) };

  const lineItems: Stripe.PaymentLinkCreateParams.LineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: "aud",
        unit_amount: toCents(input.price),
        product_data: {
          name: `Quote #${input.quoteNumber}`,
          ...(input.description ? { description: input.description.slice(0, 500) } : {}),
        },
      },
    },
  ];
  if (input.shippingCost && input.shippingCost > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "aud",
        unit_amount: toCents(input.shippingCost),
        product_data: { name: input.shippingLabel || "Shipping" },
      },
    });
  }

  const link = await stripe.paymentLinks.create({
    line_items: lineItems,
    metadata,
    // Also on the payment itself, so the quote number shows in the Stripe
    // dashboard next to the charge when matching payouts or refunds.
    payment_intent_data: { metadata },
    after_completion: {
      type: "redirect",
      redirect: { url: `${SITE_URL}/projects/services/3d-printing/thank-you?quoteId=${input.quoteNumber}` },
    },
    restrictions: { completed_sessions: { limit: 1 } },
    inactive_message: "This payment link is no longer active. Reply to your quote email and I'll send a new one.",
  });

  return { id: link.id, url: link.url };
}

/**
 * Switches off a link that shouldn't be paid any more (quote cancelled,
 * re-priced, or already paid). A failure is logged rather than thrown: the
 * status change matters more, and the single-use limit still protects against
 * a second payment.
 */
export async function deactivatePaymentLink(linkId: string | null | undefined): Promise<void> {
  if (!linkId || !isStripeConfigured()) return;
  try {
    const stripe = await getStripe();
    await stripe.paymentLinks.update(linkId, { active: false });
  } catch (err) {
    console.error("[stripe] Could not deactivate payment link", linkId, err);
  }
}

/** Test hook: drop the cached client so a test can swap the key or mock. */
export function resetStripeClientForTests(): void {
  client = null;
}
