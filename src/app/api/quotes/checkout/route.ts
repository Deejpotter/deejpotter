/**
 * /api/quotes/checkout — Creates a Stripe Checkout Session for a quote
 *
 * Called from the customer-facing status lookup page when a quote has been
 * priced and is ready for payment. Uses MongoDB quote numbers (no login required).
 */

import { NextResponse } from "next/server";
import { getQuoteForCustomer, updateQuote } from "@/lib/db-quotes";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    if (!STRIPE_KEY) {
      return NextResponse.json(
        { error: "Payments not configured. Set STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const quoteNumber = Number(body.quoteNumber ?? body.quoteId);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!Number.isFinite(quoteNumber) || quoteNumber <= 0) {
      return NextResponse.json({ error: "quoteNumber is required." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const quote = await getQuoteForCustomer(quoteNumber, email);
    if (!quote) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    if (quote.status === "awaiting_payment") {
      return NextResponse.json(
        { error: "This quote already has a pending payment. Please check your quote status." },
        { status: 400 }
      );
    }

    if (quote.status !== "quoted") {
      const statusMessages: Record<string, string> = {
        new: "Your quote is still being reviewed.",
        reviewing: "Your quote is under review.",
        approved: "Payment for this quote has already been confirmed.",
        in_progress: "This print is already in progress.",
        ready: "This order is ready for pickup/shipping.",
        completed: "This order has been completed.",
        declined: "This quote was declined.",
        cancelled: "This quote was cancelled.",
      };
      return NextResponse.json(
        { error: statusMessages[quote.status] || `This quote is not available for payment (status: ${quote.status}).` },
        { status: 400 }
      );
    }

    if (!quote.quotedPrice || quote.quotedPrice <= 0) {
      return NextResponse.json(
        { error: "This quote does not have a price set yet." },
        { status: 400 }
      );
    }

    const MIN_PRICE_AUD = 2.0;
    if (quote.quotedPrice < MIN_PRICE_AUD) {
      return NextResponse.json(
        { error: `Minimum order value is $${MIN_PRICE_AUD.toFixed(2)} AUD.` },
        { status: 400 }
      );
    }

    const stripe = await import("stripe");
    const client = new stripe.default(STRIPE_KEY);
    const params = (quote.params || {}) as Record<string, unknown>;
    const material = String(params.material || "Custom");

    const session = await client.checkout.sessions.create({
      mode: "payment",
      customer_email: quote.userEmail,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: `3D Printing — ${quote.userName.slice(0, 100)}`,
              description: `Material: ${material.slice(0, 200)} · Qty: ${Math.min(Number(params.quantity) || 1, 1000)}`,
            },
            unit_amount: Math.round(quote.quotedPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        quoteNumber: String(quote.quoteNumber),
        type: "3d-printing-quote",
      },
      success_url: `${BASE_URL}/projects/services/3d-printing/thank-you?quoteNumber=${quote.quoteNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/projects/services/3d-printing/cancelled?quoteNumber=${quote.quoteNumber}`,
    });

    await updateQuote(quote.quoteNumber, {
      status: "awaiting_payment",
      stripeCheckoutUrl: session.url,
      stripeSessionId: session.id,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("3d-printing-checkout error:", error);
    return NextResponse.json(
      { error: "Could not create checkout session. Please try again later." },
      { status: 500 }
    );
  }
}
