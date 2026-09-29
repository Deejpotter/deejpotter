"use client";

/**
 * QuoteStatusLookup — Lets a customer follow their order without an account
 *
 * Every order email links here with ?quote=<number>, so the quote number is
 * filled in and the customer only types their email (which proves it's their
 * quote). The status wording and timeline come from quote-workflow so they
 * match the emails exactly. Payment only ever happens through the link Deej
 * sent; this page just shows that same link again.
 */

import { ReactElement, useEffect, useState } from "react";
import { customerStatusLabel, trackingUrl, type DeliveryMethod } from "@/lib/quote-workflow";
import type { QuoteStatus } from "@/lib/db-schemas";

type QuoteStatusResponse = {
  requestId: string;
  status: QuoteStatus;
  quotedPrice: number | null;
  turnaroundEstimate: string | null;
  createdAt: string;
  updatedAt: string;
  fileName: string;
  material: string;
  quantity: number;
  deliveryMethod: DeliveryMethod;
  shippingCost: number | null;
  shippingLabel: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  paymentLinkUrl: string | null;
  paidAt: string | null;
  history: { status: QuoteStatus; at: string }[];
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

/** What happens next, in plain words, for each status. */
function nextStepText(result: QuoteStatusResponse): string | null {
  switch (result.status) {
    case "new":
    case "reviewing":
      return "I'm checking your file. You'll get an email with the price and a payment link.";
    case "quoted":
    case "awaiting_payment":
      return "Your quote is ready. I'll start as soon as it's paid.";
    case "approved":
      return "Paid, thanks. Your job is in the queue.";
    case "in_progress":
      return "Your job is being made now.";
    case "ready":
      if (result.trackingNumber) return "Your parcel is on its way.";
      return result.deliveryMethod === "local_delivery"
        ? "Your order is on its way to you."
        : "Ready to collect in Frankston. Reply to your email to arrange a time.";
    default:
      return null;
  }
}

export default function QuoteStatusLookup(): ReactElement {
  const [requestId, setRequestId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Prefill from the link in the customer's email.
  useEffect(() => {
    const quote = new URLSearchParams(window.location.search).get("quote");
    if (quote && /^\d+$/.test(quote)) setRequestId(quote);
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({ requestId, email });
      const response = await fetch(`/api/3d-printing-quote/status?${params.toString()}`, { cache: "no-store" });
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

  const shipped = Boolean(result?.trackingNumber);
  const track = result ? trackingUrl(result.carrier, result.trackingNumber) : null;
  const total = result?.quotedPrice != null ? result.quotedPrice + (result.shippingCost ?? 0) : null;

  return (
    <section id="quote-status" className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-5 dark:border-gray-800 dark:bg-gray-950/40 sm:px-8">
        <h2 className="mb-2 text-3xl font-bold">Check your order</h2>
        <p className="max-w-2xl text-gray-600 dark:text-gray-400">
          Enter your quote number and the email you used on the quote request.
        </p>
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
            <input id="status-email" type="email" className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <button
            className="inline-flex items-center justify-center rounded-full border border-primary px-5 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 dark:text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check order"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-50" role="alert">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-50" role="status">
            <div className="mb-1 text-xl font-bold">
              {customerStatusLabel(result.status, { deliveryMethod: result.deliveryMethod, shipped })}
            </div>
            <div className="mb-3 text-sm">
              Quote {result.requestId} · {result.fileName} · {result.material} × {result.quantity}
            </div>
            {nextStepText(result) && <p className="mb-3">{nextStepText(result)}</p>}

            {total != null && (
              <p className="mb-1">
                Price: ${result.quotedPrice!.toFixed(2)}
                {result.shippingCost ? ` + ${result.shippingLabel || "delivery"} $${result.shippingCost.toFixed(2)} = $${total.toFixed(2)}` : ""}
              </p>
            )}
            {result.quotedPrice == null && result.estimate?.analysisAvailable && result.estimate.estimatedPriceAud != null && (
              <p className="mb-1">Automatic estimate: about ${result.estimate.estimatedPriceAud.toFixed(2)} (I&apos;ll confirm it)</p>
            )}
            {result.turnaroundEstimate && <p className="mb-1">Turnaround: {result.turnaroundEstimate}</p>}

            {result.paymentLinkUrl && total != null && (
              <a
                href={result.paymentLinkUrl}
                className="mt-3 inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Pay ${total.toFixed(2)} securely with Stripe
              </a>
            )}

            {result.trackingNumber && (
              <p className="mt-3">
                Tracking:{" "}
                {track ? (
                  <a href={track} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                    {result.trackingNumber}
                  </a>
                ) : (
                  result.trackingNumber
                )}
              </p>
            )}

            {result.history.length > 0 && (
              <ol className="mt-4 space-y-1 border-t border-sky-200 pt-3 text-sm dark:border-sky-900/60">
                {result.history.map((h, i) => (
                  <li key={i}>
                    <span className="text-sky-900/70 dark:text-sky-100/70">
                      {new Date(h.at).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                    </span>{" "}
                    {customerStatusLabel(h.status, { deliveryMethod: result.deliveryMethod, shipped })}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
