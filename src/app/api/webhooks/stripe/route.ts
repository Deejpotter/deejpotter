/**
 * /api/webhooks/stripe — Marks quotes paid when Stripe confirms a payment
 *
 * This is the one step of the order flow that must happen without Deej: a
 * customer pays the emailed Payment Link, Stripe calls this endpoint, and the
 * quote moves to "paid" with emails to both sides. The quote number comes from
 * the Payment Link's metadata, which Stripe copies onto the checkout session.
 *
 * Two events can mean "paid": checkout.session.completed for cards, and
 * checkout.session.async_payment_succeeded for methods that settle later
 * (their "completed" event arrives unpaid). Both must be subscribed in Stripe.
 *
 * Safety checks, in order:
 * - Signature: anyone could otherwise post a fake "paid" event.
 * - Claim: event ids are recorded in MongoDB with a lease, so a repeated
 *   delivery can't pay twice, and a crash mid-way is retried rather than lost.
 * - Match: the payment must come from the quote's current link, in AUD, for
 *   the amount the quote asked for. A stale link (price since changed) or
 *   odd amount is flagged to Deej instead of silently approving the quote.
 */

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { claimStripeEvent, getQuote, markStripeEventDone, releaseStripeEvent } from "@/lib/db-quotes";
import { notifyAdminPaymentProblem } from "@/lib/email";
import { performQuoteAction } from "@/lib/quote-actions";
import { getStripe } from "@/lib/stripe-payments";

const PAID_EVENTS = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!process.env.STRIPE_SECRET_KEY || !secret) {
    console.error("[stripe webhook] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is missing");
    return NextResponse.json({ error: "Stripe webhooks aren't configured." }, { status: 500 });
  }

  // The signature covers the raw body, so it must be read as text, not JSON.
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    const stripe = await getStripe();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[stripe webhook] Signature check failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (!PAID_EVENTS.has(event.type)) return NextResponse.json({ received: true });

  const session = event.data.object as Stripe.Checkout.Session;
  const quoteNumber = Number(session.metadata?.quoteNumber);
  // Payments that aren't for a quote (e.g. a link made by hand in the Stripe
  // dashboard) are left alone.
  if (!quoteNumber) return NextResponse.json({ received: true });

  // A delayed method's "completed" event arrives before the money does; the
  // async_payment_succeeded event that follows is the one that pays.
  if (session.payment_status !== "paid") {
    console.info(`[stripe webhook] Quote #${quoteNumber} session completed but payment is ${session.payment_status}`);
    return NextResponse.json({ received: true });
  }

  if (!(await claimStripeEvent(event.id, event.type))) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    await handlePaidSession(quoteNumber, session);
    await markStripeEventDone(event.id);
  } catch (err) {
    // A 500 makes Stripe retry, which is what we want if the database blipped.
    console.error(`[stripe webhook] Failed to handle payment for quote #${quoteNumber}:`, err);
    await releaseStripeEvent(event.id).catch(() => undefined);
    return NextResponse.json({ error: "Could not record payment." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * Pays the quote if the payment matches what was asked for; otherwise emails
 * Deej, because money has been taken and a person has to decide what to do.
 */
async function handlePaidSession(quoteNumber: number, session: Stripe.Checkout.Session) {
  const quote = await getQuote(quoteNumber);
  const flag = (problem: string) => {
    console.warn(`[stripe webhook] Quote #${quoteNumber}: ${problem}`);
    return notifyAdminPaymentProblem(quoteNumber, `${problem} Nothing was changed; check the payment in Stripe and whether a refund is needed.`);
  };

  if (!quote) return flag(`A Stripe payment arrived for quote #${quoteNumber}, which doesn't exist.`);

  if (quote.status !== "awaiting_payment" && quote.status !== "quoted") {
    return flag(`Quote #${quoteNumber} was paid through Stripe while its status was "${quote.status}".`);
  }

  const paid = session.amount_total != null ? session.amount_total / 100 : null;
  const expected = quote.quotedPrice != null ? Math.round((quote.quotedPrice + (quote.delivery?.cost ?? 0)) * 100) / 100 : null;
  const currentLink = quote.payment?.paymentLinkId ?? null;
  const sessionLink = typeof session.payment_link === "string" ? session.payment_link : session.payment_link?.id ?? null;

  if (currentLink && sessionLink && sessionLink !== currentLink) {
    return flag(`Quote #${quoteNumber} was paid through an old payment link (the quote has since been re-sent with a new price).`);
  }
  if ((session.currency ?? "aud").toLowerCase() !== "aud") {
    return flag(`Quote #${quoteNumber} was paid in ${session.currency}, not AUD.`);
  }
  if (expected != null && paid != null && Math.abs(paid - expected) > 0.005) {
    return flag(`Quote #${quoteNumber} was paid $${paid.toFixed(2)} but the quote total is $${expected.toFixed(2)}.`);
  }

  await performQuoteAction(quoteNumber, "mark_paid", { amountPaid: paid, stripeSessionId: session.id }, "stripe");
  console.info(`[stripe webhook] Quote #${quoteNumber} paid`);
}
