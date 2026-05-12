"use client";

import { ReactElement, useState } from "react";

type QuoteEstimate = {
  analysisAvailable: boolean;
  triangleCount?: number;
  boundingBoxMm?: { x: number; y: number; z: number };
  estimatedMaterialGrams?: number;
  estimatedPrintHours?: number;
  estimatedPriceAud?: number;
  previewNote: string;
  fileKind: "stl" | "other";
  confidence: "low" | "medium";
};

const acceptedFileTypes = ".stl,.3mf,.obj,.step,.stp";

const fieldShell =
  "rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow focus-within:border-primary/40 focus-within:shadow-md dark:border-gray-700 dark:bg-gray-900";
const labelClass =
  "mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100";
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white";
const selectClass = inputClass;
const textareaClass = inputClass;

export default function QuoteRequestForm(): ReactElement {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("submitting");
    setErrorMessage(null);
    setSuccessMessage(null);
    setEstimate(null);

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
      const baseMessage =
        payload.message ||
        "Quote request sent. I will review the file and get back to you.";
      const requestId = payload.requestId ? ` Request ID: ${payload.requestId}.` : "";
      setSuccessMessage(`${baseMessage}${requestId}`);
      setEstimate(payload.estimate ?? null);
      form.reset();
    } catch {
      setFormStatus("error");
      setErrorMessage(
        "Something went wrong while sending the quote request. Please try again."
      );
    }
  };

  return (
    <form
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
      onSubmit={onSubmit}
    >
      <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-5 dark:border-gray-800 dark:bg-gray-950/40 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Request a print quote</h2>
            <p className="max-w-2xl text-gray-600 dark:text-gray-400">
              Send the file and the basics. This is the practical first version
              of the quoting flow before live auto-pricing is added.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            STL upload ready
          </span>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className={fieldShell}>
            <label htmlFor="quote-name" className={labelClass}>
              Name
            </label>
            <input id="quote-name" name="name" className={inputClass} required />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-email" className={labelClass}>
              Email
            </label>
            <input
              id="quote-email"
              name="email"
              type="email"
              className={inputClass}
              required
            />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-suburb" className={labelClass}>
              Suburb / area
            </label>
            <input
              id="quote-suburb"
              name="suburb"
              className={inputClass}
              placeholder="Frankston, Seaford, Mornington..."
              required
            />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-material" className={labelClass}>
              Material
            </label>
            <select
              id="quote-material"
              name="material"
              className={selectClass}
              defaultValue="PLA"
            >
              <option value="PLA">PLA</option>
              <option value="PETG">PETG</option>
              <option value="ABS">ABS</option>
              <option value="TPU">TPU</option>
              <option value="Unsure">Not sure yet</option>
            </select>
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-quantity" className={labelClass}>
              Quantity
            </label>
            <input
              id="quote-quantity"
              name="quantity"
              type="number"
              min={1}
              max={1000}
              defaultValue={1}
              className={inputClass}
              required
            />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-file" className={labelClass}>
              Model file
            </label>
            <input
              id="quote-file"
              name="modelFile"
              type="file"
              className={inputClass}
              accept={acceptedFileTypes}
              required
            />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Accepted: STL, 3MF, OBJ, STEP, STP.
            </div>
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-local" className={labelClass}>
              Local delivery / pickup
            </label>
            <select
              id="quote-local"
              name="localFulfilment"
              className={selectClass}
              defaultValue="yes"
            >
              <option value="yes">Yes - local</option>
              <option value="no">No - not local</option>
              <option value="unsure">Not sure</option>
            </select>
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-next-day" className={labelClass}>
              Need next day?
            </label>
            <select
              id="quote-next-day"
              name="needsNextDay"
              className={selectClass}
              defaultValue="no"
            >
              <option value="no">No</option>
              <option value="yes">Yes, if viable</option>
            </select>
          </div>
          <div className="md:col-span-2 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <label htmlFor="quote-notes" className={labelClass}>
              Notes
            </label>
            <textarea
              id="quote-notes"
              name="notes"
              rows={5}
              className={textareaClass}
              placeholder="Part purpose, dimensions, finish expectations, colour preference, deadline, or anything else useful."
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={formStatus === "submitting"}
          >
            {formStatus === "submitting" ? "Sending request..." : "Request quote"}
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Large or urgent jobs may still need manual confirmation before next-day turnaround is promised.
          </div>
        </div>

        {successMessage && (
          <div
            className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-50"
            role="alert"
          >
            <div>{successMessage}</div>
            {estimate && (
              <div className="mt-4 border-t border-emerald-200 pt-4 dark:border-emerald-900/60">
                <div className="mb-2 font-semibold">Automatic preflight estimate</div>
                {estimate.analysisAvailable ? (
                  <>
                    <div className="mb-1 text-sm">
                      Estimated starting price: ${estimate.estimatedPriceAud?.toFixed(2)}
                    </div>
                    <div className="mb-1 text-sm">
                      Estimated print time: {estimate.estimatedPrintHours} hours
                    </div>
                    <div className="mb-1 text-sm">
                      Estimated material: {estimate.estimatedMaterialGrams} g
                    </div>
                    {estimate.boundingBoxMm && (
                      <div className="mb-1 text-sm">
                        Approx size: {estimate.boundingBoxMm.x} x {estimate.boundingBoxMm.y} x {estimate.boundingBoxMm.z} mm
                      </div>
                    )}
                    {typeof estimate.triangleCount === "number" && (
                      <div className="mb-1 text-sm">Triangle count: {estimate.triangleCount}</div>
                    )}
                  </>
                ) : (
                  <div className="mb-1 text-sm">
                    Automatic STL preflight was not available for this file.
                  </div>
                )}
                <div className="mt-2 text-sm text-emerald-900/80 dark:text-emerald-100/80">
                  {estimate.previewNote}
                </div>
              </div>
            )}
          </div>
        )}
        {errorMessage && (
          <div
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950 shadow-sm dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-50"
            role="alert"
          >
            {errorMessage}
          </div>
        )}
      </div>
    </form>
  );
}
