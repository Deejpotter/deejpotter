/**
 * /api/shop/3d-printing-checkout — Creates a Stripe Checkout Session for a quote
 *
 * Called when admin has set a price and the customer is ready to pay.
 * Returns a URL to redirect the customer to Stripe's hosted checkout page.
 *
 * Requires STRIPE_SECRET_KEY in .env
 * Requires NEXT_PUBLIC_BASE_URL for redirect URLs (or falls back to localhost)
 */

import { NextResponse } from "next/server";
import {
  getQuoteRequest,
  getQuoteRequestForCustomer,
  updateQuoteRequest,
} from "@/lib/quote-storage";

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
    const { quoteId, email } = body;

    if (!quoteId || typeof quoteId !== "string") {
      return NextResponse.json({ error: "quoteId is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email is required." }, { status: 400 });
    }

    // Fetch the quote — verify it exists and belongs to this email
    const quote = await getQuoteRequestForCustomer(quoteId, email);
    if (!quote) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    // Verify the quote is in a payable state
    if (quote.status !== "quoted") {
      return NextResponse.json(
        { error: `This quote is not available for payment (status: ${quote.status}).` },
        { status: 400 }
      );
    }

    if (!quote.quotedPrice || quote.quotedPrice <= 0) {
      return NextResponse.json(
        { error: "This quote does not have a price set yet." },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const stripe = await import("stripe");
    const client = new stripe.default(STRIPE_KEY);

    const session = await client.checkout.sessions.create({
      mode: "payment",
      customer_email: quote.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: `3D Printing — ${quote.name}`,
              description: `Material: ${quote.customMaterial || quote.material} · Qty: ${quote.quantity}`,
            },
            unit_amount: Math.round(quote.quotedPrice * 100), // convert AUD to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        quoteId: quote.id,
        type: "3d-printing-quote",
      },
      success_url: `${BASE_URL}/shop/3d-printing/thank-you?quoteId=${quote.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/shop/3d-printing/cancelled?quoteId=${quote.id}`,
    });

    // Store the Stripe session info on the quote
    await updateQuoteRequest(quote.id, {
      stripeCheckoutUrl: session.url || null,
      stripeSessionId: session.id,
      status: "awaiting_payment",
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("3d-printing-checkout error", error);
    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 }
    );
  }
}
