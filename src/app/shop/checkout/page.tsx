"use client";

/**
 * /shop/checkout — Stripe Checkout page
 *
 * Shows order summary from cart and collects payment via Stripe Elements.
 * Requires NEXT_PUBLIC_STRIPE_KEY in environment.
 */

import { useState } from "react";
import { useCart, safeName } from "@/lib/cart-context";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Link from "next/link";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY || "";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

// ── Inner payment form ──

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || items.length === 0) return;

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const res = await fetch("/api/shop/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: safeName(i.name),
            price: i.price,
            quantity: i.quantity,
            type: i.type,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Payment setup failed");
      }

      const { clientSecret } = await res.json();

      // Confirm with Stripe
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/shop/checkout/success`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      // Payment succeeded
      clearCart();
      window.location.href = "/shop/checkout/success";
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || items.length === 0}
        className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {processing ? "Processing..." : `Pay ${formatPrice(total)}`}
      </button>
    </form>
  );
}

// ── Main checkout page ──

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);

  async function initializeCheckout() {
    if (!stripeKey) {
      setInitError("Payment system not configured. Please try again later.");
      return;
    }
    if (items.length === 0) return;

    setInitializing(true);
    setInitError(null);

    try {
      const res = await fetch("/api/shop/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: safeName(i.name),
            price: i.price,
            quantity: i.quantity,
            type: i.type,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not initialize payment");
      }

      const { clientSecret: secret } = await res.json();
      setClientSecret(secret);
    } catch (err: any) {
      setInitError(err.message || "Payment initialization failed");
    } finally {
      setInitializing(false);
    }
  }

  // Empty cart
  if (itemCount === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-extrabold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some products before checking out.</p>
        <Link href="/shop" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90">
          Browse Shop
        </Link>
      </main>
    );
  }

  const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Payment form */}
        <div className="lg:col-span-3">
          {!stripePromise && (
            <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm mb-4">
              Payment is not configured. Please contact the site owner.
            </div>
          )}

          {!clientSecret ? (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Click below to start the payment process.
              </p>
              <button
                onClick={initializeCheckout}
                disabled={initializing || !stripePromise}
                className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold disabled:opacity-50 transition-colors"
              >
                {initializing ? "Preparing payment..." : "Continue to Payment"}
              </button>
              {initError && (
                <p className="text-red-600 text-sm">{initError}</p>
              )}
            </div>
          ) : stripePromise ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "stripe" } } as StripeElementsOptions}
            >
              <CheckoutForm />
            </Elements>
          ) : null}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 truncate max-w-[60%]">
                    {safeName(item.name)} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
