/**
 * /api/shop/create-payment-intent — Stripe payment intent creation
 */

import { NextResponse } from "next/server";
import { createPaymentIntentSchema } from "@/lib/shop-schemas";
import { createOrder, attachPaymentIntent } from "@/lib/db-shop-orders";

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

    const { items, email } = parsed.data;

    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (amount <= 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = await createOrder({
      email: email || "pending@checkout.local",
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        type: i.type,
      })),
      total: amount,
    });

    const stripe = await import("stripe");
    const client = new stripe.default(STRIPE_KEY);

    const paymentIntent = await client.paymentIntents.create({
      amount,
      currency: "aud",
      receipt_email: email || undefined,
      metadata: {
        orderId: order._id,
        type: "shop_order",
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

    await attachPaymentIntent(order._id, paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: order._id,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    return NextResponse.json({ error: "Could not create payment." }, { status: 500 });
  }
}
