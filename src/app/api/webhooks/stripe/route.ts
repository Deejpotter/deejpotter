/**
 * /api/webhooks/stripe — Stripe webhook handler
 *
 * Listens for checkout.session.completed events to update quote status.
 * Verifies webhook signature using STRIPE_WEBHOOK_SECRET.
 */

import { NextResponse } from "next/server";
import { updateQuoteRequest, getQuoteRequest } from "@/lib/quote-storage";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: { type: string; data: { object: Record<string, unknown> } };

  try {
    if (!STRIPE_KEY) {
      return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });
    }

    if (WEBHOOK_SECRET) {
      // Verify webhook signature
      const stripe = await import("stripe");
      const client = new stripe.default(STRIPE_KEY);
      const constructed = client.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
      event = constructed as unknown as typeof event;
    } else {
      // Fallback: parse without verification (dev only)
      console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error("Stripe webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata as Record<string, string> | undefined;

    if (metadata?.type === "3d-printing-quote" && metadata.quoteId) {
      try {
        const quote = await getQuoteRequest(metadata.quoteId);
        if (quote && quote.status === "awaiting_payment") {
          await updateQuoteRequest(metadata.quoteId, {
            status: "approved",
          });
          console.info(`Quote ${metadata.quoteId} marked as approved (payment received)`);
        } else if (quote) {
          console.info(`Quote ${metadata.quoteId} status is "${quote.status}" — skipping update`);
        }
      } catch (err) {
        console.error(`Failed to update quote ${metadata.quoteId} after payment:`, err);
      }
    }
  }

  // Handle checkout.session.expired — return to "quoted" so they can try again
  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const metadata = session.metadata as Record<string, string> | undefined;

    if (metadata?.type === "3d-printing-quote" && metadata.quoteId) {
      try {
        const quote = await getQuoteRequest(metadata.quoteId);
        if (quote && quote.status === "awaiting_payment") {
          await updateQuoteRequest(metadata.quoteId, {
            status: "quoted",
            stripeCheckoutUrl: null,
            stripeSessionId: null,
          });
          console.info(`Quote ${metadata.quoteId} returned to "quoted" (session expired)`);
        }
      } catch (err) {
        console.error(`Failed to expire quote ${metadata.quoteId}:`, err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
