"use client";

/**
 * PayNowButton — Client component that creates a Stripe checkout
 * session and redirects the customer to pay.
 */

import { useState } from "react";

interface PayNowButtonProps {
  quoteNumber: number;
  label?: string;
}

export default function PayNowButton({
  quoteNumber,
  label = "Pay now",
}: PayNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/quote-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteNumber }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Could not start checkout");
      }
    } catch {
      setError("Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={loading}
        className="mt-2 inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Preparing..." : label}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
