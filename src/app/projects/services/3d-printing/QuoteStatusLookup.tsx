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
  estimate?: {
    analysisAvailable: boolean;
    estimatedPriceAud?: number;
    estimatedPrintHours?: number;
    estimatedMaterialGrams?: number;
    previewNote: string;
  } | null;
};

export default function QuoteStatusLookup(): ReactElement {
  const [requestId, setRequestId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="card shadow-sm border-0 bg-white">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
          <div>
            <h2 className="h3 mb-2">Check your quote status</h2>
            <p className="text-muted mb-0">
              Enter your request ID and the same email address used on the quote request.
            </p>
          </div>
          <span className="badge text-bg-light border">Self-serve status</span>
        </div>

        <form className="row g-3" onSubmit={onSubmit}>
          <div className="col-md-7">
            <label htmlFor="status-request-id" className="form-label">
              Request ID
            </label>
            <input
              id="status-request-id"
              className="form-control"
              value={requestId}
              onChange={(event) => setRequestId(event.target.value)}
              placeholder="Paste your quote request ID"
              required
            />
          </div>
          <div className="col-md-5">
            <label htmlFor="status-email" className="form-label">
              Email
            </label>
            <input
              id="status-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <button className="btn btn-outline-primary" type="submit" disabled={loading}>
              {loading ? "Checking..." : "Check quote status"}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger mt-4 mb-0" role="alert">
            {error}
          </div>
        )}

        {result && (
          <div className="alert alert-info mt-4 mb-0" role="alert">
            <div className="fw-semibold mb-2">Quote status: {result.status}</div>
            <div className="small mb-2">
              Request {result.requestId} - {result.fileName} - {result.material} x {result.quantity}
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
            {result.quotedPrice == null && result.estimate?.analysisAvailable && (
              <>
                <div className="mb-1">
                  Preliminary estimate: from ${result.estimate.estimatedPriceAud?.toFixed(2)}
                </div>
                <div className="mb-1 small text-muted">
                  Approx {result.estimate.estimatedPrintHours} hours and {result.estimate.estimatedMaterialGrams} g material
                </div>
              </>
            )}
            {result.estimate?.previewNote && (
              <div className="small text-muted mb-1">{result.estimate.previewNote}</div>
            )}
            <div className="text-muted small">
              Last updated {new Date(result.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
