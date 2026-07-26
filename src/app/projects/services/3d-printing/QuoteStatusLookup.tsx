"use client";

import { ReactElement, useState } from "react";

type QuoteStatusResponse = {
  requestId: string;
  status: string;
  quotedPrice: number | null;
  turnaroundEstimate: string | null;
  createdAt: string;
  updatedAt: string;
  fileName: string;
  material: string;
  quantity: number;
  stripeCheckoutUrl: string | null;
  estimate?: {
    analysisAvailable: boolean;
    estimatedPriceAud?: number;
    estimatedPrintHours?: number;
    estimatedMaterialGrams?: number;
    previewNote: string;
  } | null;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

export default function QuoteStatusLookup(): ReactElement {
  const [requestId, setRequestId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  const statusLabels: Record<string, string> = {
    new: "New — awaiting review",
    reviewing: "Under review",
    quoted: "Quoted — ready for payment",
    awaiting_payment: "Awaiting payment confirmation",
    approved: "Approved — printing in queue",
    printing: "Printing",
    ready: "Ready for pickup/shipping",
    completed: "Completed",
    declined: "Declined",
  };

  const handlePayNow = async (quoteNumber: string) => {
    setPaying(true);
    setError(null);
    try {
      const res = await fetch("/api/shop/3d-printing-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteNumber: Number(quoteNumber), email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create payment session.");
        setPaying(false);
        return;
      }
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Could not connect to payment service.");
      setPaying(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({ requestId, email });
      const response = await fetch(`/api/3d-printing-quote/status?${params.toString()}`, {
        cache: "no-store",
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload.error || "Could not load quote status.");
        return;
      }

      setResult(payload);
    } catch {
      setError("Could not load quote status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-5 dark:border-gray-800 dark:bg-gray-950/40 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Check your quote status</h2>
            <p className="max-w-2xl text-gray-600 dark:text-gray-400">
              Enter your quote number and the same email address used on the quote request.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            Self-serve status
          </span>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <form className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-end" onSubmit={onSubmit}>
          <div>
            <label htmlFor="status-request-id" className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
              Quote number
            </label>
            <input
              id="status-request-id"
              className={inputClass}
              value={requestId}
              onChange={(event) => setRequestId(event.target.value)}
              placeholder="e.g. 1001"
              inputMode="numeric"
              pattern="[0-9]+"
              required
            />
          </div>
          <div>
            <label htmlFor="status-email" className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
              Email
            </label>
            <input
              id="status-email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <button
            className="inline-flex items-center justify-center rounded-full border border-primary px-5 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 dark:text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check quote status"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950 shadow-sm dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-50" role="alert">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-950 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-50" role="status">
            <div className="mb-2 text-xl font-bold">Quote status: {statusLabels[result.status] || result.status}</div>
            <div className="mb-2 text-sm">
              Quote {result.requestId} - {result.fileName} - {result.material} x {result.quantity}
            </div>
            <div className="mb-1">
              {result.quotedPrice != null
                ? `Quoted price: $${result.quotedPrice.toFixed(2)}`
                : "Quoted price: pending review"}
            </div>
            <div className="mb-1">
              {result.turnaroundEstimate
                ? `Turnaround: ${result.turnaroundEstimate}`
                : "Turnaround: pending review"}
            </div>

            {/* Pay Now button — shown when quote is ready */}
            {result.status === "quoted" && result.quotedPrice != null && result.quotedPrice > 0 && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => handlePayNow(result.requestId)}
                  disabled={paying}
                  className="inline-flex items-center rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-70"
                >
                  {paying ? "Redirecting to payment..." : `Pay $${result.quotedPrice.toFixed(2)} now`}
                </button>
                <p className="text-xs text-gray-500 mt-2">Secure payment via Stripe. Your card is never stored here.</p>
              </div>
            )}

            {result.status === "awaiting_payment" && (
              <div className="mt-3 text-amber-700 dark:text-amber-300 font-medium">
                ⏳ Payment is being processed...
              </div>
            )}

            {result.status === "approved" && (
              <div className="mt-3 text-emerald-700 dark:text-emerald-300 font-medium">
                ✅ Payment confirmed! Your print is in the queue.
              </div>
            )}

            {result.quotedPrice == null && result.estimate?.analysisAvailable && (
              <>
                <div className="mb-1">
                  Preliminary estimate: from ${result.estimate.estimatedPriceAud?.toFixed(2)}
                </div>
                <div className="mb-1 text-sm text-sky-900/80 dark:text-sky-100/80">
                  Approx {result.estimate.estimatedPrintHours} hours and {result.estimate.estimatedMaterialGrams} g material
                </div>
              </>
            )}
            {result.estimate?.previewNote && (
              <div className="mb-1 text-sm text-sky-900/80 dark:text-sky-100/80">{result.estimate.previewNote}</div>
            )}
            <div className="text-sm text-sky-900/70 dark:text-sky-100/70">
              Last updated {new Date(result.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
