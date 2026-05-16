/**
 * /api/shop/create-payment-intent — Stripe payment intent creation
 *
 * Requires STRIPE_SECRET_KEY in .env
 * Returns a client_secret for the frontend to confirm payment.
 */

import { NextResponse } from "next/server";
import { createPaymentIntentSchema } from "@/lib/shop-schemas";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";

export async function POST(request: Request) {
  try {
    if (!STRIPE_KEY) {
      return NextResponse.json(
        { error: "Payment not configured. Set STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const parsed = createPaymentIntentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    const { items } = parsed.data;

    // Calculate total in AUD cents
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (amount <= 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create Stripe Payment Intent
    const stripe = await import("stripe");
    const client = new stripe.default(STRIPE_KEY, {
      apiVersion: "2025-02-24.acacia",
    });

    const paymentIntent = await client.paymentIntents.create({
      amount,
      currency: "aud",
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({
            id: i.productId,
            name: i.name,
            qty: i.quantity,
            type: i.type,
          }))
        ),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    return NextResponse.json({ error: "Could not create payment." }, { status: 500 });
  }
}
