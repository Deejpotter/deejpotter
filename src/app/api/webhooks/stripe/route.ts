/**
 * /api/webhooks/stripe — Stripe webhook handler
 *
 * Listens for checkout.session.completed events to update quote status.
 * Verifies webhook signature using STRIPE_WEBHOOK_SECRET.
 *
 * Idempotency: checks the Stripe event ID before processing to prevent
 * duplicate webhook deliveries from double-processing an event.
 */

import { NextResponse } from "next/server";
import { updateQuote, getQuote } from "@/lib/db-quotes";
import { updateOrderStatus, getOrderById } from "@/lib/db-shop-orders";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Simple in-memory deduplication — prevents double-processing in the same
// process lifetime. Cleared on server restart, which is acceptable since
// Stripe retries with backoff give plenty of time.
const processedEvents = new Set<string>();

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  if (!STRIPE_KEY) {
    console.error("STRIPE_SECRET_KEY not configured — webhooks disabled");
    return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });
  }

  // Verify webhook signature (strongly recommended in production)
  if (!WEBHOOK_SECRET) {
    // In dev, warn but allow — in prod we'd reject
    if (BASE_URL !== "http://localhost:3000") {
      console.error("STRIPE_WEBHOOK_SECRET is required in production");
      return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
    }
    console.warn("STRIPE_WEBHOOK_SECRET not set — dev mode, skipping signature verification");
  }

  let event: { id: string; type: string; data: { object: Record<string, unknown> } };
  try {
    if (WEBHOOK_SECRET) {
      const stripe = await import("stripe");
      const client = new stripe.default(STRIPE_KEY);
      event = client.webhooks.constructEvent(body, signature, WEBHOOK_SECRET) as unknown as typeof event;
    } else {
      event = JSON.parse(body);
      // Basic sanity: must have id and type
      if (!event.id || !event.type) {
        return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
      }
    }
  } catch (err) {
    console.error("Stripe webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // ── Idempotency check ───────────────────────────────────────────
  // Stripe may deliver the same event multiple times.
  if (processedEvents.has(event.id)) {
    console.info(`Webhook ${event.id} (${event.type}) already processed — skipping`);
    return NextResponse.json({ received: true, deduplicated: true });
  }
  processedEvents.add(event.id);

  // Limit set size to prevent memory leak on long-running dev servers
  if (processedEvents.size > 1000) {
    const entries = Array.from(processedEvents);
    const toRemove = entries.slice(0, 500);
    for (const e of toRemove) {
      processedEvents.delete(e);
    }
  }

  // ── Handle payment_intent.succeeded (shop orders) ────────────────
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const metadata = (paymentIntent.metadata || {}) as Record<string, string>;

    if (metadata.type === "shop_order" && metadata.orderId) {
      try {
        const order = await getOrderById(metadata.orderId);
        if (!order) {
          console.error(`Webhook: shop order ${metadata.orderId} not found`);
          return NextResponse.json({ received: true });
        }

        if (order.status === "paid") {
          return NextResponse.json({ received: true });
        }

        const receiptEmail =
          (paymentIntent.receipt_email as string | null) ||
          (paymentIntent.charges as { data?: Array<{ billing_details?: { email?: string } }> })?.data?.[0]
            ?.billing_details?.email;

        await updateOrderStatus(metadata.orderId, "paid", {
          stripePaymentIntentId: paymentIntent.id as string,
          email: receiptEmail || undefined,
        });
        console.info(`Webhook: shop order ${metadata.orderId} → paid`);
      } catch (err) {
        console.error(`Webhook: failed to update shop order ${metadata.orderId}:`, err);
      }
      return NextResponse.json({ received: true });
    }
  }

  // ── Handle checkout.session.completed ────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = (session.metadata || {}) as Record<string, string>;

    // Handle quotes paid via the new quote checkout
    if (metadata.quoteNumber) {
      const quoteNumber = Number(metadata.quoteNumber);
      console.info(`Webhook: payment completed for quote #${quoteNumber}`);

      try {
        const quote = await getQuote(quoteNumber);
        if (!quote) {
          console.error(`Webhook: quote #${quoteNumber} not found`);
          return NextResponse.json({ received: true });
        }

        if (quote.status !== "awaiting_payment") {
          console.info(`Webhook: quote #${quoteNumber} status is "${quote.status}" — nothing to do`);
          return NextResponse.json({ received: true });
        }

        await updateQuote(quoteNumber, {
          status: "approved",
          paidAt: new Date().toISOString(),
        });
        console.info(`Webhook: quote #${quoteNumber} → approved (paid)`);
      } catch (err) {
        console.error(`Webhook: failed to update quote #${quoteNumber}:`, err);
      }
      return NextResponse.json({ received: true });
    }
  }

  // ── Handle checkout.session.expired ──────────────────────────────
  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const metadata = (session.metadata || {}) as Record<string, string>;

    if (metadata.quoteNumber) {
      const quoteNumber = Number(metadata.quoteNumber);
      try {
        const quote = await getQuote(quoteNumber);
        if (quote && quote.status === "awaiting_payment") {
          await updateQuote(quoteNumber, {
            status: "quoted",
            stripeCheckoutUrl: null,
            stripeSessionId: null,
          });
          console.info(`Webhook: quote #${quoteNumber} → "quoted" (session expired)`);
        }
      } catch (err) {
        console.error(`Webhook: failed to expire quote #${quoteNumber}:`, err);
      }
      return NextResponse.json({ received: true });
    }
  }

  return NextResponse.json({ received: true });
}
