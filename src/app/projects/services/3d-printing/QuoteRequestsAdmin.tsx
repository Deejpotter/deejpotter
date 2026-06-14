"use client";

import { useEffect, useState } from "react";

interface QuoteRecord {
  _id: string;
  quoteNumber: number;
  name: string;
  email: string;
  suburb: string;
  serviceType: string;
  status: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  material?: string;
  quantity?: number;
  params?: Record<string, unknown>;
  analysis?: Record<string, unknown> | null;
  quotedPrice: number | null;
  turnaroundEstimate: string | null;
  queuePosition: number | null;
  adminNotes: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  payment?: { stripeCheckoutUrl: string | null; stripeSessionId: string | null; paidAt: string | null };
}

const STATUSES = [
  { value: "new", label: "New", color: "bg-amber-500" },
  { value: "reviewing", label: "Reviewing", color: "bg-blue-500" },
  { value: "quoted", label: "Quoted", color: "bg-purple-500" },
  { value: "awaiting_payment", label: "Awaiting Payment", color: "bg-orange-500" },
  { value: "approved", label: "Approved", color: "bg-green-500" },
  { value: "in_progress", label: "In Progress", color: "bg-sky-500" },
  { value: "ready", label: "Ready", color: "bg-emerald-500" },
  { value: "completed", label: "Completed", color: "bg-green-600" },
  { value: "declined", label: "Declined", color: "bg-red-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-gray-400" },
];

const inputClass =
  "rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm";

export default function QuoteRequestsAdmin() {
  const [records, setRecords] = useState<QuoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [draftPrices, setDraftPrices] = useState<Record<number, string>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/quotes");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setRecords(data);
    } catch {
      setError("Could not load quotes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (quoteNumber: number, patch: Record<string, unknown>) => {
    setSavingId(quoteNumber);
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteNumber, ...patch }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setRecords((prev) =>
        prev.map((r) =>
          r.quoteNumber === quoteNumber ? { ...r, ...updated } : r,
        ),
      );
    } catch {
      alert("Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  const recalculate = async () => {
    try {
      await fetch("/api/admin/quotes", { method: "POST" });
      load();
    } catch {
      alert("Failed to recalculate");
    }
  };

  const filtered =
    filter === "all"
      ? records
      : records.filter((r) => {
          if (filter === "active")
            return !["completed", "declined", "cancelled"].includes(r.status);
          return r.status === filter;
        });

  if (loading) {
    return (
      <div className="animate-pulse space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={load}
          className="rounded-full bg-primary px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`${inputClass} min-w-[120px]`}
        >
          <option value="all">All quotes</option>
          <option value="active">Active only</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={recalculate}
          className="text-sm text-primary hover:underline"
        >
          Recalculate queue
        </button>
        <span className="text-sm text-gray-500 ml-auto">
          {filtered.length} quote{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No quotes found.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => {
            const mat =
              ((record.params as Record<string, unknown>)?.material as string) ||
              record.fileName ||
              "—";
            const analysis = record.analysis;
            const status = STATUSES.find(
              (s) => s.value === record.status,
            );

            return (
              <div
                key={record.quoteNumber}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold">
                        #{record.quoteNumber}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${status?.color || "bg-gray-400"}`}
                      >
                        {status?.label || record.status}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {record.serviceType?.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm font-medium">
                      {record.name} — {mat}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.email} • {record.suburb} •{" "}
                      {new Date(record.createdAt).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                </div>

                {/* Analysis summary */}
                {analysis?.estimatedPriceAud != null && (
                  <div className="grid grid-cols-4 gap-2 mb-3 text-xs text-gray-500">
                    <div>
                      Est. price:{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${Number(analysis.estimatedPriceAud).toFixed(2)}
                      </span>
                    </div>
                    {analysis.estimatedPrintHours != null && (
                      <div>{Number(analysis.estimatedPrintHours).toFixed(1)} hrs</div>
                    )}
                    {analysis.estimatedMaterialGrams != null && (
                      <div>{Number(analysis.estimatedMaterialGrams).toFixed(0)}g</div>
                    )}
                    {analysis.boundingBoxMm != null && (
                      <div>
                        {(analysis.boundingBoxMm as { x: number; y: number; z: number }).x}
                        ×
                        {(analysis.boundingBoxMm as { x: number; y: number; z: number }).y}
                        ×
                        {(analysis.boundingBoxMm as { x: number; y: number; z: number }).z}{" "}
                        mm
                      </div>
                    )}
                  </div>
                )}

                {/* Queue position */}
                {record.queuePosition != null && (
                  <p className="text-xs text-gray-500 mb-3">
                    Queue position: #{record.queuePosition}{" "}
                    {record.turnaroundEstimate && (
                      <span className="text-primary font-medium">
                        · {record.turnaroundEstimate}
                      </span>
                    )}
                  </p>
                )}

                {/* Admin controls */}
                <div className="flex flex-wrap items-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-0.5">
                      Status
                    </label>
                    <select
                      value={record.status}
                      onChange={(e) =>
                        save(record.quoteNumber, { status: e.target.value })
                      }
                      disabled={savingId === record.quoteNumber}
                      className={`${inputClass} text-xs`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-0.5">
                      Price (AUD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={draftPrices[record.quoteNumber] ?? record.quotedPrice ?? ""}
                      onChange={(e) =>
                        setDraftPrices((prev) => ({
                          ...prev,
                          [record.quoteNumber]: e.target.value,
                        }))
                      }
                      onBlur={() => {
                        const val = draftPrices[record.quoteNumber];
                        if (val === undefined) return;
                        save(record.quoteNumber, {
                          quotedPrice: val ? Number(val) : null,
                        });
                        setDraftPrices((prev) => {
                          const next = { ...prev };
                          delete next[record.quoteNumber];
                          return next;
                        });
                      }}
                      disabled={savingId === record.quoteNumber}
                      className={`${inputClass} w-24 text-xs`}
                      placeholder="—"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-0.5">
                      Turnaround
                    </label>
                    <input
                      type="text"
                      value={record.turnaroundEstimate || ""}
                      onChange={(e) =>
                        save(record.quoteNumber, {
                          turnaroundEstimate: e.target.value || null,
                        })
                      }
                      disabled={savingId === record.quoteNumber}
                      className={`${inputClass} w-40 text-xs`}
                      placeholder="ETA: 3 days"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-400 mb-0.5">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={record.adminNotes || ""}
                      onChange={(e) =>
                        save(record.quoteNumber, {
                          adminNotes: e.target.value || null,
                        })
                      }
                      disabled={savingId === record.quoteNumber}
                      className={`${inputClass} w-full text-xs`}
                      placeholder="Internal notes..."
                    />
                  </div>
                </div>

                {/* Customer notes */}
                {record.notes && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    &quot;{record.notes}&quot;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
