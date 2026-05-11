"use client";

import { ReactElement, useState } from "react";

const acceptedFileTypes = ".stl,.3mf,.obj,.step,.stp";

export default function QuoteRequestForm(): ReactElement {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("submitting");
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/3d-printing-quote", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFormStatus("error");
        setErrorMessage(
          payload.error ||
            "Could not submit the quote request. Please check the form and try again."
        );
        return;
      }

      setFormStatus("success");
      setSuccessMessage(
        payload.message ||
          "Quote request sent. I will review the file and get back to you."
      );
      form.reset();
    } catch {
      setFormStatus("error");
      setErrorMessage(
        "Something went wrong while sending the quote request. Please try again."
      );
    }
  };

  return (
    <form className="card shadow-sm border-0 bg-white" onSubmit={onSubmit}>
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
          <div>
            <h2 className="h3 mb-2">Request a print quote</h2>
            <p className="text-muted mb-0">
              Send the file and the basics. This is the practical first version
              of the quoting flow before live auto-pricing is added.
            </p>
          </div>
          <span className="badge text-bg-light border">STL upload ready</span>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="quote-name" className="form-label">
              Name
            </label>
            <input id="quote-name" name="name" className="form-control" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="quote-email" className="form-label">
              Email
            </label>
            <input
              id="quote-email"
              name="email"
              type="email"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="quote-suburb" className="form-label">
              Suburb / area
            </label>
            <input
              id="quote-suburb"
              name="suburb"
              className="form-control"
              placeholder="Frankston, Seaford, Mornington..."
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="quote-material" className="form-label">
              Material
            </label>
            <select id="quote-material" name="material" className="form-select" defaultValue="PLA">
              <option value="PLA">PLA</option>
              <option value="PETG">PETG</option>
              <option value="ABS">ABS</option>
              <option value="TPU">TPU</option>
              <option value="Unsure">Not sure yet</option>
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="quote-quantity" className="form-label">
              Quantity
            </label>
            <input
              id="quote-quantity"
              name="quantity"
              type="number"
              min={1}
              max={1000}
              defaultValue={1}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="quote-file" className="form-label">
              Model file
            </label>
            <input
              id="quote-file"
              name="modelFile"
              type="file"
              className="form-control"
              accept={acceptedFileTypes}
              required
            />
            <div className="form-text">Accepted: STL, 3MF, OBJ, STEP, STP.</div>
          </div>
          <div className="col-md-3">
            <label htmlFor="quote-local" className="form-label">
              Local delivery / pickup
            </label>
            <select id="quote-local" name="localFulfilment" className="form-select" defaultValue="yes">
              <option value="yes">Yes - local</option>
              <option value="no">No - not local</option>
              <option value="unsure">Not sure</option>
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="quote-next-day" className="form-label">
              Need next day?
            </label>
            <select id="quote-next-day" name="needsNextDay" className="form-select" defaultValue="no">
              <option value="no">No</option>
              <option value="yes">Yes, if viable</option>
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="quote-notes" className="form-label">
              Notes
            </label>
            <textarea
              id="quote-notes"
              name="notes"
              rows={5}
              className="form-control"
              placeholder="Part purpose, dimensions, finish expectations, colour preference, deadline, or anything else useful."
            />
          </div>
        </div>

        <div className="d-flex flex-wrap gap-3 align-items-center mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={formStatus === "submitting"}
          >
            {formStatus === "submitting" ? "Sending request..." : "Request quote"}
          </button>
          <div className="text-muted small">
            Large or urgent jobs may still need manual confirmation before next-day turnaround is promised.
          </div>
        </div>

        {successMessage && (
          <div className="alert alert-success mt-4 mb-0" role="alert">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger mt-4 mb-0" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </form>
  );
}
