/**
 * /api/shop/3d-printing-checkout — Creates a Stripe Checkout Session for a quote
 *
 * Called from the customer-facing status lookup page when a quote has been
 * priced and is ready for payment.
 *
 * Security:
 * - Quote is fetched by ID + email so only the customer who submitted it can pay
 * - Only quotes in "quoted" status are accepted
 * - Checkout URL is stored server-side — customers are redirected, not given the URL directly
 * - Stripe handles all PCI compliance and card data
 *
 * Requires STRIPE_SECRET_KEY in .env
 * Requires NEXT_PUBLIC_BASE_URL for redirect URLs (falls back to localhost)
 */

import { NextResponse } from "next/server";
import { getQuoteRequestForCustomer, updateQuoteRequest } from "@/lib/quote-storage";

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

    // Validate request body
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { quoteId, email } = body;

    if (!quoteId || typeof quoteId !== "string") {
      return NextResponse.json({ error: "quoteId is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    // Trim excess whitespace from email
    const normalizedEmail = email.trim().toLowerCase();

    // Fetch the quote — verify it exists and belongs to this email
    const quote = await getQuoteRequestForCustomer(quoteId, normalizedEmail);
    if (!quote) {
      // Don't reveal whether it's a bad ID or bad email — same error message
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    // Verify the quote is in a payable state
    if (quote.status === "awaiting_payment") {
      // A session was already created. Check if it's still valid or expired.
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
        printing: "This print is already in progress.",
        ready: "This order is ready for pickup/shipping.",
        completed: "This order has been completed.",
        declined: "This quote was declined.",
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

    // Enforce a minimum price to prevent $0 or trivial charges
    const MIN_PRICE_AUD = 2.00;
    if (quote.quotedPrice < MIN_PRICE_AUD) {
      return NextResponse.json(
        { error: `Minimum order value is $${MIN_PRICE_AUD.toFixed(2)} AUD.` },
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
              name: `3D Printing — ${quote.name.slice(0, 100)}`,
              description: `Material: ${(quote.customMaterial || quote.material).slice(0, 200)} · Qty: ${Math.min(quote.quantity, 1000)}`,
            },
            unit_amount: Math.round(quote.quotedPrice * 100), // AUD to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        quoteId: quote.id,
        type: "3d-printing-quote",
      },
      success_url: `${BASE_URL}/shop/3d-printing/thank-you?quoteId=${encodeURIComponent(quote.id)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/shop/3d-printing/cancelled?quoteId=${encodeURIComponent(quote.id)}`,
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
    console.error("3d-printing-checkout error:", error);
    return NextResponse.json(
      { error: "Could not create checkout session. Please try again later." },
      { status: 500 }
    );
  }
}
