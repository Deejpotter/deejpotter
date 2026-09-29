/**
 * /api/webhooks/stripe — Marks quotes paid when Stripe confirms a payment
 *
 * This is the one step of the order flow that must happen without Deej: a
 * customer pays the emailed Payment Link, Stripe calls this endpoint, and the
 * quote moves to "paid" with emails to both sides. The quote number comes from
 * the Payment Link's metadata, which Stripe copies onto the checkout session.
 *
 * Every request is signature-checked, because anyone could otherwise post a
 * fake "paid" event. Event ids are recorded in MongoDB so a repeated delivery
 * (Stripe retries until it gets a 2xx) can't pay a quote twice, even across
 * Render restarts.
 */

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { claimStripeEvent, getQuote, releaseStripeEvent } from "@/lib/db-quotes";
import { notifyAdminPaymentProblem } from "@/lib/email";
import { performQuoteAction } from "@/lib/quote-actions";
import { getStripe } from "@/lib/stripe-payments";

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

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const quoteNumber = Number(session.metadata?.quoteNumber);
  // Payments that aren't for a quote (e.g. a link made by hand in the Stripe
  // dashboard) are left alone.
  if (!quoteNumber) return NextResponse.json({ received: true });

  // Some payment methods complete the session before the money arrives; those
  // are paid later and aren't treated as paid here.
  if (session.payment_status !== "paid") {
    console.info(`[stripe webhook] Quote #${quoteNumber} session completed but payment is ${session.payment_status}`);
    return NextResponse.json({ received: true });
  }

  if (!(await claimStripeEvent(event.id, event.type))) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    const quote = await getQuote(quoteNumber);
    if (!quote) {
      console.error(`[stripe webhook] Paid quote #${quoteNumber} not found`);
      return NextResponse.json({ received: true });
    }
    if (quote.status !== "awaiting_payment" && quote.status !== "quoted") {
      // Paid after being cancelled, or marked paid by hand already: Deej needs
      // to know (possible refund), but the status shouldn't jump backwards.
      console.warn(`[stripe webhook] Quote #${quoteNumber} was paid while "${quote.status}"; left unchanged`);
      await notifyAdminPaymentProblem(
        quoteNumber,
        `Quote #${quoteNumber} was paid through Stripe while its status was "${quote.status}". Nothing was changed; check whether the customer needs a refund.`,
      ).catch((err) => console.error("[stripe webhook] Admin email failed:", err));
      return NextResponse.json({ received: true });
    }

    await performQuoteAction(
      quoteNumber,
      "mark_paid",
      {
        amountPaid: session.amount_total != null ? session.amount_total / 100 : null,
        stripeSessionId: session.id,
      },
      "stripe",
    );
    console.info(`[stripe webhook] Quote #${quoteNumber} paid`);
  } catch (err) {
    // A 500 makes Stripe retry, which is what we want if the database blipped.
    console.error(`[stripe webhook] Failed to mark quote #${quoteNumber} paid:`, err);
    await releaseStripeEvent(event.id).catch(() => undefined);
    return NextResponse.json({ error: "Could not record payment." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
