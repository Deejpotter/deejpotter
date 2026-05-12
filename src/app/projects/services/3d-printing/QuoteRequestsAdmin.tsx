"use client";

import { ReactElement, useEffect, useState } from "react";

type QuoteRecord = {
  id: string;
  name: string;
  email: string;
  suburb: string;
  material: string;
  quantity: number;
  localFulfilment: "yes" | "no" | "unsure";
  needsNextDay: "yes" | "no";
  notes: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: string;
  quotedPrice?: number | null;
  turnaroundEstimate?: string | null;
  adminNotes?: string | null;
  analysis?: {
    analysisAvailable: boolean;
    triangleCount?: number;
    boundingBoxMm?: { x: number; y: number; z: number };
    estimatedMaterialGrams?: number;
    estimatedPrintHours?: number;
    estimatedPriceAud?: number;
    previewNote: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

const statuses = [
  "new",
  "reviewing",
  "quoted",
  "approved",
  "printing",
  "ready",
  "completed",
  "declined",
] as const;

const fieldLabel =
  "mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100";
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

export default function QuoteRequestsAdmin(): ReactElement {
  const [records, setRecords] = useState<QuoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/3d-printing-quote", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Could not load quote requests.");
        return;
      }
      setRecords(payload);
    } catch {
      setError("Could not load quote requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (event: React.FormEvent<HTMLFormElement>, record: QuoteRecord) => {
    event.preventDefault();
    setSavingId(record.id);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/3d-printing-quote", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: record.id,
          status: formData.get("status"),
          quotedPrice: formData.get("quotedPrice") ? Number(formData.get("quotedPrice")) : null,
          turnaroundEstimate: (formData.get("turnaroundEstimate") || "").toString() || null,
          adminNotes: (formData.get("adminNotes") || "").toString() || null,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Could not update the quote request.");
        return;
      }

      setRecords((current) =>
        current.map((item) => (item.id === record.id ? payload : item))
      );
    } catch {
      setError("Could not update the quote request.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        Loading quote requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-900 shadow-sm dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {records.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          No quote requests yet.
        </div>
      ) : (
        records.map((record) => (
          <form
            key={record.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
            onSubmit={(event) => save(event, record)}
          >
            <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-5 dark:border-gray-800 dark:bg-gray-950/40 sm:px-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="mb-1 text-2xl font-bold">{record.name}</h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {record.email} - {record.suburb} - {new Date(record.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                    {record.material}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                    Qty {record.quantity}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/20 dark:text-white">
                    {record.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950/40">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    File
                  </div>
                  <a
                    href={`/api/3d-printing-quote/${record.id}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    {record.fileName}
                  </a>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {(record.fileSize / 1024).toFixed(1)} KB - {record.fileType || "unknown"}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950/40">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Delivery notes
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Local: {record.localFulfilment} - Next day requested: {record.needsNextDay}
                  </div>
                </div>
              </div>

              {record.notes && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Customer notes
                  </div>
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {record.notes}
                  </div>
                </div>
              )}

              {record.analysis && (
                <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-sm dark:border-sky-900/50 dark:bg-sky-950/30">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200">
                    Automatic preflight
                  </div>
                  {record.analysis.analysisAvailable ? (
                    <div className="space-y-1 text-sky-950 dark:text-sky-50">
                      <div className="text-sm">
                        Starting estimate: ${record.analysis.estimatedPriceAud?.toFixed(2)}
                      </div>
                      <div className="text-sm">Print time: {record.analysis.estimatedPrintHours} h</div>
                      <div className="text-sm">Material: {record.analysis.estimatedMaterialGrams} g</div>
                      {record.analysis.boundingBoxMm && (
                        <div className="text-sm">
                          Size: {record.analysis.boundingBoxMm.x} x {record.analysis.boundingBoxMm.y} x {record.analysis.boundingBoxMm.z} mm
                        </div>
                      )}
                      {typeof record.analysis.triangleCount === "number" && (
                        <div className="text-sm">Triangles: {record.analysis.triangleCount}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-sky-950 dark:text-sky-50">
                      No automatic STL estimate was available for this file.
                    </div>
                  )}
                  <div className="mt-2 text-sm text-sky-900/80 dark:text-sky-100/80">
                    {record.analysis.previewNote}
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:items-end">
                <div>
                  <label className={fieldLabel}>Status</label>
                  <select name="status" className={inputClass} defaultValue={record.status}>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Quoted price</label>
                  <input
                    name="quotedPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={record.quotedPrice ?? ""}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={fieldLabel}>Turnaround estimate</label>
                  <input
                    name="turnaroundEstimate"
                    defaultValue={record.turnaroundEstimate ?? ""}
                    className={inputClass}
                    placeholder="e.g. Next day if approved by 4pm"
                  />
                </div>
                <div>
                  <button
                    className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={savingId === record.id}
                  >
                    {savingId === record.id ? "Saving..." : "Save update"}
                  </button>
                </div>
                <div className="md:col-span-2 xl:col-span-4">
                  <label className={fieldLabel}>Admin notes</label>
                  <textarea
                    name="adminNotes"
                    rows={4}
                    defaultValue={record.adminNotes ?? ""}
                    className={inputClass}
                    placeholder="Internal notes, print concerns, quote assumptions, or customer follow-up notes."
                  />
                </div>
              </div>
            </div>
          </form>
        ))
      )}
    </div>
  );
}
