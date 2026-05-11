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
    return <div className="alert alert-secondary">Loading quote requests...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="d-flex flex-column gap-4">
      {records.length === 0 ? (
        <div className="alert alert-secondary mb-0">No quote requests yet.</div>
      ) : (
        records.map((record) => (
          <form
            key={record.id}
            className="card shadow-sm border-0 bg-white"
            onSubmit={(event) => save(event, record)}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <h2 className="h4 mb-1">{record.name}</h2>
                  <div className="text-muted small">
                    {record.email} - {record.suburb} - {new Date(record.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge text-bg-light border">{record.material}</span>
                  <span className="badge text-bg-light border">Qty {record.quantity}</span>
                  <span className="badge text-bg-light border">{record.status}</span>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div className="small text-uppercase text-muted mb-1">File</div>
                  <a href={`/api/3d-printing-quote/${record.id}/file`} target="_blank" rel="noopener noreferrer">
                    {record.fileName}
                  </a>
                  <div className="text-muted small mt-1">
                    {(record.fileSize / 1024).toFixed(1)} KB - {record.fileType || "unknown"}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="small text-uppercase text-muted mb-1">Delivery notes</div>
                  <div>
                    Local: {record.localFulfilment} - Next day requested: {record.needsNextDay}
                  </div>
                </div>
              </div>

              {record.notes && (
                <div className="mb-3">
                  <div className="small text-uppercase text-muted mb-1">Customer notes</div>
                  <div>{record.notes}</div>
                </div>
              )}

              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-select" defaultValue={record.status}>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Quoted price</label>
                  <input
                    name="quotedPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={record.quotedPrice ?? ""}
                    className="form-control"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Turnaround estimate</label>
                  <input
                    name="turnaroundEstimate"
                    defaultValue={record.turnaroundEstimate ?? ""}
                    className="form-control"
                    placeholder="e.g. Next day if approved by 4pm"
                  />
                </div>
                <div className="col-md-3">
                  <button className="btn btn-primary w-100" type="submit" disabled={savingId === record.id}>
                    {savingId === record.id ? "Saving..." : "Save update"}
                  </button>
                </div>
                <div className="col-12">
                  <label className="form-label">Admin notes</label>
                  <textarea
                    name="adminNotes"
                    rows={3}
                    defaultValue={record.adminNotes ?? ""}
                    className="form-control"
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
