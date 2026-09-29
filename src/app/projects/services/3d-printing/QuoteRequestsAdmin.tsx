"use client";

/**
 * QuoteRequestsAdmin — Deej's quote board
 *
 * Each quote shows only the next steps that make sense for it (from
 * quote-workflow), so the board works as a checklist: send the quote, wait for
 * Stripe, start, ship, complete. Every button goes through the action API,
 * which emails the customer; the "Fix status by hand" control underneath is
 * for correcting mistakes and deliberately sends nothing.
 */

import { useEffect, useState } from "react";
import {
  ACTION_LABELS,
  adminActionsFor,
  customerStatusLabel,
  trackingUrl,
  type DeliveryMethod,
  type QuoteAction,
} from "@/lib/quote-workflow";
import type { QuoteStatus } from "@/lib/db-schemas";

interface QuoteRecord {
  _id: string;
  quoteNumber: number;
  name: string;
  email: string;
  suburb: string;
  serviceType: string;
  status: QuoteStatus;
  fileName: string;
  params?: Record<string, unknown>;
  analysis?: {
    estimatedPriceAud?: number;
    estimatedPrintHours?: number;
    estimatedMaterialGrams?: number;
    boundingBoxMm?: { x: number; y: number; z: number };
  } | null;
  quotedPrice: number | null;
  turnaroundEstimate: string | null;
  queuePosition: number | null;
  adminNotes: string | null;
  notes: string;
  createdAt: string;
  delivery?: {
    method: DeliveryMethod;
    postcode?: string;
    cost: number | null;
    estimate: string | null;
    service?: string | null;
    carrier?: string | null;
    trackingNumber?: string | null;
  };
  payment?: { paymentLinkUrl?: string | null; paymentLinkId?: string | null; amountPaid?: number | null; paidAt: string | null };
  statusHistory?: { status: QuoteStatus; at: string; by: string; note?: string }[];
}

const ALL_STATUSES: QuoteStatus[] = [
  "new", "reviewing", "quoted", "awaiting_payment", "approved", "in_progress", "ready", "completed", "declined", "cancelled",
];

const STATUS_COLOURS: Record<QuoteStatus, string> = {
  new: "bg-amber-500",
  reviewing: "bg-blue-500",
  quoted: "bg-purple-500",
  awaiting_payment: "bg-orange-500",
  approved: "bg-green-500",
  in_progress: "bg-sky-500",
  ready: "bg-emerald-500",
  completed: "bg-green-700",
  declined: "bg-red-500",
  cancelled: "bg-gray-400",
};

const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  pickup: "Pickup (Frankston)",
  local_delivery: "Local delivery",
  shipped: "Post",
};

const inputClass =
  "rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm";
const money = (n: number | null | undefined) => (n == null ? "—" : `$${n.toFixed(2)}`);

export default function QuoteRequestsAdmin() {
  const [records, setRecords] = useState<QuoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [filter, setFilter] = useState("active");
  // Which inline form is open (send quote / ship) for which quote.
  const [openForm, setOpenForm] = useState<{ quoteNumber: number; action: "send_quote" | "ship" } | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/quotes");
      if (!res.ok) throw new Error("Failed to load");
      setRecords(await res.json());
    } catch {
      setError("Could not load quotes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const replace = (updated: QuoteRecord) =>
    setRecords((prev) => prev.map((r) => (r.quoteNumber === updated.quoteNumber ? { ...r, ...updated } : r)));

  /** Runs one workflow step; the server's message is shown if it refuses. */
  const runAction = async (quoteNumber: number, action: QuoteAction, input: Record<string, unknown> = {}) => {
    setBusyId(quoteNumber);
    try {
      const res = await fetch("/api/admin/quotes/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteNumber, action, ...input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      replace(data);
      setOpenForm(null);
      // The step is saved either way; this tells Deej the customer may not know.
      if (data.emailSent === false) {
        const link = data.payment?.paymentLinkUrl && action === "send_quote" ? `\n\nPayment link to send by hand:\n${data.payment.paymentLinkUrl}` : "";
        alert(`Saved, but the email to ${data.userEmail} didn't send. Let the customer know another way.${link}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusyId(null);
    }
  };

  /** Quiet edits (notes, turnaround, manual status): no customer email. */
  const save = async (quoteNumber: number, patch: Record<string, unknown>) => {
    setBusyId(quoteNumber);
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteNumber, ...patch }),
      });
      if (!res.ok) throw new Error("Failed");
      replace(await res.json());
    } catch {
      alert("Failed to save");
    } finally {
      setBusyId(null);
    }
  };

  const onActionClick = (record: QuoteRecord, action: QuoteAction) => {
    if (action === "send_quote" || action === "ship") {
      setOpenForm({ quoteNumber: record.quoteNumber, action });
      return;
    }
    if (action === "decline" || action === "cancel") {
      const reason = prompt(`${ACTION_LABELS[action]} #${record.quoteNumber}. Reason for the customer (optional):`);
      if (reason === null) return;
      runAction(record.quoteNumber, action, { reason: reason || null });
      return;
    }
    if (action === "mark_paid" && !confirm(`Mark #${record.quoteNumber} as paid? The customer gets a receipt email.`)) return;
    runAction(record.quoteNumber, action);
  };

  const filtered = records.filter((r) => {
    if (filter === "all") return true;
    if (filter === "active") return !["completed", "declined", "cancelled"].includes(r.status);
    return r.status === filter;
  });

  if (loading) {
    return (
      <div className="animate-pulse space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={load} className="rounded-full bg-primary px-4 py-2 text-white">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputClass} min-w-[120px]`}>
          <option value="active">Active</option>
          <option value="all">All quotes</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {customerStatusLabel(s)}
            </option>
          ))}
        </select>
        <button onClick={() => fetch("/api/admin/quotes", { method: "POST" }).then(load)} className="text-sm text-primary hover:underline">
          Recalculate queue
        </button>
        <span className="text-sm text-gray-500 ml-auto">
          {filtered.length} quote{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No quotes found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => {
            const method = record.delivery?.method ?? "pickup";
            const actions = adminActionsFor(record.status, {
              deliveryMethod: method,
              hasPaymentLink: Boolean(record.payment?.paymentLinkUrl),
            });
            const busy = busyId === record.quoteNumber;
            const track = trackingUrl(record.delivery?.carrier, record.delivery?.trackingNumber);
            const material = (record.params?.material as string) || "—";
            const quantity = (record.params?.quantity as number) || 1;

            return (
              <article key={record.quoteNumber} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <header className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold">#{record.quoteNumber}</span>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white ${STATUS_COLOURS[record.status] ?? "bg-gray-400"}`}>
                        {customerStatusLabel(record.status, { deliveryMethod: method, shipped: Boolean(record.delivery?.trackingNumber) })}
                      </span>
                    </div>
                    <p className="text-sm font-medium">
                      {record.name} · {material} × {quantity} · {record.fileName || "no file"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.email} · {record.suburb}
                      {record.delivery?.postcode ? ` ${record.delivery.postcode}` : ""} · {new Date(record.createdAt).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>{DELIVERY_LABELS[method]}{record.delivery?.estimate ? ` · ${record.delivery.estimate}` : ""}</div>
                    <div>
                      Job {money(record.quotedPrice ?? record.analysis?.estimatedPriceAud)}
                      {record.quotedPrice == null && record.analysis?.estimatedPriceAud != null ? " (estimate)" : ""}
                      {method !== "pickup" ? ` + delivery ${money(record.delivery?.cost)}` : ""}
                    </div>
                    {record.payment?.paidAt && <div className="text-green-600">Paid {money(record.payment.amountPaid)}</div>}
                  </div>
                </header>

                {record.analysis?.estimatedMaterialGrams != null && (
                  <p className="mb-3 text-xs text-gray-500">
                    Estimate: {record.analysis.estimatedMaterialGrams}g · {record.analysis.estimatedPrintHours} hrs
                    {record.analysis.boundingBoxMm &&
                      ` · ${record.analysis.boundingBoxMm.x} × ${record.analysis.boundingBoxMm.y} × ${record.analysis.boundingBoxMm.z} mm`}
                    {record.queuePosition != null && ` · queue #${record.queuePosition}`}
                  </p>
                )}

                {record.notes && <p className="mb-3 text-xs italic text-gray-500">&quot;{record.notes}&quot;</p>}

                {record.payment?.paymentLinkUrl && !record.payment.paidAt && (
                  <p className="mb-3 text-xs">
                    Payment link:{" "}
                    <a href={record.payment.paymentLinkUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
                      {record.payment.paymentLinkUrl}
                    </a>
                  </p>
                )}
                {record.delivery?.trackingNumber && (
                  <p className="mb-3 text-xs">
                    Tracking: {track ? <a href={track} target="_blank" rel="noopener noreferrer" className="text-primary underline">{record.delivery.trackingNumber}</a> : record.delivery.trackingNumber}
                  </p>
                )}

                {/* Next steps */}
                {actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                    {actions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        disabled={busy}
                        onClick={() => onActionClick(record, action)}
                        className={
                          action === "decline" || action === "cancel"
                            ? "rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 disabled:opacity-50"
                            : "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                        }
                      >
                        {ACTION_LABELS[action]}
                      </button>
                    ))}
                  </div>
                )}

                {openForm?.quoteNumber === record.quoteNumber && openForm.action === "send_quote" && (
                  <SendQuoteForm record={record} busy={busy} onCancel={() => setOpenForm(null)} onSubmit={(input) => runAction(record.quoteNumber, "send_quote", input)} />
                )}
                {openForm?.quoteNumber === record.quoteNumber && openForm.action === "ship" && (
                  <ShipForm busy={busy} onCancel={() => setOpenForm(null)} onSubmit={(input) => runAction(record.quoteNumber, "ship", input)} />
                )}

                <details className="mt-3 text-xs text-gray-500">
                  <summary className="cursor-pointer">Timeline, notes and manual fixes</summary>
                  <ol className="mt-2 space-y-1">
                    {(record.statusHistory ?? []).map((h, i) => (
                      <li key={i}>
                        {new Date(h.at).toLocaleString("en-AU")} · {customerStatusLabel(h.status, { deliveryMethod: method })} · by {h.by}
                        {h.note ? ` · ${h.note}` : ""}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-3 flex flex-wrap items-end gap-2">
                    <label>
                      <span className="block text-[10px]">Turnaround</span>
                      <input
                        defaultValue={record.turnaroundEstimate || ""}
                        onBlur={(e) => e.target.value !== (record.turnaroundEstimate || "") && save(record.quoteNumber, { turnaroundEstimate: e.target.value || null })}
                        className={`${inputClass} w-40 text-xs`}
                        placeholder="3 business days"
                      />
                    </label>
                    <label className="flex-1">
                      <span className="block text-[10px]">Internal notes</span>
                      <input
                        defaultValue={record.adminNotes || ""}
                        onBlur={(e) => e.target.value !== (record.adminNotes || "") && save(record.quoteNumber, { adminNotes: e.target.value || null })}
                        className={`${inputClass} w-full text-xs`}
                      />
                    </label>
                    <label>
                      <span className="block text-[10px]">Fix status by hand (no email)</span>
                      <select
                        value={record.status}
                        disabled={busy}
                        onChange={(e) => confirm("Change the status without emailing the customer?") && save(record.quoteNumber, { status: e.target.value })}
                        className={`${inputClass} text-xs`}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Price confirmation before the payment link goes out. Prefilled from the
 * automatic estimate and the shipping the customer picked, so most quotes are
 * a check and a click.
 */
function SendQuoteForm({
  record,
  busy,
  onCancel,
  onSubmit,
}: {
  record: QuoteRecord;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (input: Record<string, unknown>) => void;
}) {
  const method = record.delivery?.method ?? "pickup";
  const [price, setPrice] = useState(String(record.quotedPrice ?? record.analysis?.estimatedPriceAud ?? ""));
  const [shipping, setShipping] = useState(String(record.delivery?.cost ?? ""));
  const [turnaround, setTurnaround] = useState(record.turnaroundEstimate ?? "");
  const total = (Number(price) || 0) + (method === "pickup" ? 0 : Number(shipping) || 0);

  return (
    <form
      className="mt-3 flex flex-wrap items-end gap-2 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-900"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          price: Number(price),
          shippingCost: method === "pickup" ? 0 : Number(shipping),
          shippingLabel: record.delivery?.estimate || null,
          turnaround: turnaround || null,
        });
      }}
    >
      <label>
        <span className="block text-[10px]">Job price (AUD)</span>
        <input type="number" step="0.01" min="0.5" required value={price} onChange={(e) => setPrice(e.target.value)} className={`${inputClass} w-24`} />
      </label>
      {method !== "pickup" && (
        <label>
          <span className="block text-[10px]">{record.delivery?.estimate || "Delivery"} (AUD)</span>
          <input type="number" step="0.01" min="0" required={method === "shipped"} value={shipping} onChange={(e) => setShipping(e.target.value)} className={`${inputClass} w-24`} />
        </label>
      )}
      <label>
        <span className="block text-[10px]">Turnaround after payment</span>
        <input value={turnaround} onChange={(e) => setTurnaround(e.target.value)} className={`${inputClass} w-40`} placeholder="3 business days" />
      </label>
      <button type="submit" disabled={busy} className="rounded-full bg-primary px-3 py-1 font-semibold text-white disabled:opacity-50">
        {busy ? "Sending..." : `Email quote + $${total.toFixed(2)} link`}
      </button>
      <button type="button" onClick={onCancel} className="text-gray-500 underline">
        Cancel
      </button>
    </form>
  );
}

/** Tracking details for a posted order; the customer's shipped email links to them. */
function ShipForm({ busy, onCancel, onSubmit }: { busy: boolean; onCancel: () => void; onSubmit: (input: Record<string, unknown>) => void }) {
  const [carrier, setCarrier] = useState("auspost");
  const [trackingNumber, setTrackingNumber] = useState("");
  return (
    <form
      className="mt-3 flex flex-wrap items-end gap-2 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-900"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ carrier, trackingNumber });
      }}
    >
      <label>
        <span className="block text-[10px]">Carrier</span>
        <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className={inputClass}>
          <option value="auspost">Australia Post</option>
          <option value="startrack">StarTrack</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        <span className="block text-[10px]">Tracking number</span>
        <input required value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className={`${inputClass} w-48`} />
      </label>
      <button type="submit" disabled={busy} className="rounded-full bg-primary px-3 py-1 font-semibold text-white disabled:opacity-50">
        {busy ? "Saving..." : "Mark shipped + email tracking"}
      </button>
      <button type="button" onClick={onCancel} className="text-gray-500 underline">
        Cancel
      </button>
    </form>
  );
}
