/**
 * POST /api/stripe/quote-checkout — Create Stripe checkout session for a quote
 *
 * Requires: logged-in user (Clerk) and matching quote ownership
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getQuote, updateQuote } from "@/lib/db-quotes";
import type Stripe from "stripe";

async function getStripe(): Promise<Stripe> {
  const { default: StripeSDK } = await import("stripe");
  return new StripeSDK(process.env.STRIPE_SECRET_KEY || "");
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Sign in to pay" }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payment not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const { quoteNumber } = body;

    if (!quoteNumber) {
      return NextResponse.json(
        { error: "quoteNumber is required" },
        { status: 400 },
      );
    }

    const quote = await getQuote(Number(quoteNumber));
    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 },
      );
    }

    // Only allow payment for quoted/awaiting_payment statuses
    if (!["quoted", "awaiting_payment"].includes(quote.status)) {
      return NextResponse.json(
        { error: "This quote is not ready for payment" },
        { status: 400 },
      );
    }

    // Must have a quoted price
    if (!quote.quotedPrice || quote.quotedPrice <= 0) {
      return NextResponse.json(
        { error: "No price set on this quote yet" },
        { status: 400 },
      );
    }

    // Create Stripe checkout session
    const stripe = await getStripe();
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: `${quote.serviceType.replace("_", " ")} — Quote #${quote.quoteNumber}`,
              description: quote.fileName || "Custom fabrication",
            },
            unit_amount: Math.round(quote.quotedPrice * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${BASE_URL}/shop/3d-printing/thank-you?quoteNumber=${quote.quoteNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/shop/3d-printing/cancelled?quoteNumber=${quote.quoteNumber}`,
      metadata: {
        quoteNumber: String(quote.quoteNumber),
        serviceType: quote.serviceType,
      },
      customer_email: quote.userEmail,
    });

    // Update quote with Stripe session info
    await updateQuote(quote.quoteNumber, {
      status: "awaiting_payment",
      stripeCheckoutUrl: stripeSession.url,
      stripeSessionId: stripeSession.id,
    });

    return NextResponse.json({
      url: stripeSession.url,
      sessionId: stripeSession.id,
    });
  } catch (err) {
    console.error("Quote checkout error:", err);
    return NextResponse.json(
      { error: "Could not create payment session" },
      { status: 500 },
    );
  }
}
