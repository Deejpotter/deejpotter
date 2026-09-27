"use client";

/**
 * QuoteRequestForm — Upload a model and see the full price before submitting
 *
 * The STL is measured in the browser as soon as it's picked (stl-geometry),
 * and the price uses the same maths and rates as the server (print-estimate),
 * so the number here is the number Deej sees on the quote board. Delivery
 * prices come from /api/shipping/estimate once a postcode is entered, so the
 * customer sees print + delivery as one total. The server re-measures the
 * uploaded file and re-prices delivery on submit; the browser numbers are a
 * preview, never trusted.
 */

import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { estimatePrint } from "@/lib/print-estimate";
import { measureStl, type StlGeometry } from "@/lib/stl-geometry";
import type { DeliveryOption, DeliveryOptionId } from "@/lib/shipping";

const ModelDropZone = dynamic(() => import("@/components/ModelDropZone/ModelDropZone"), { ssr: false });

type ServerEstimate = {
  analysisAvailable: boolean;
  boundingBoxMm?: { x: number; y: number; z: number };
  estimatedMaterialGrams?: number;
  estimatedPrintHours?: number;
  estimatedPriceAud?: number;
  previewNote: string;
  needsManualQuote?: boolean;
};

const acceptedFileTypes = ".stl,.3mf,.obj,.step,.stp";

const fieldShell =
  "rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow focus-within:border-primary/40 focus-within:shadow-md dark:border-gray-700 dark:bg-gray-900";
const labelClass = "mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100";
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

// Labels only; the speed of each quality comes from the server's settings.
const QUALITY_PRESETS = [
  { id: "draft", label: "Draft (0.3mm)", desc: "Fast print, visible layer lines" },
  { id: "standard", label: "Standard (0.2mm)", desc: "Good balance of speed and quality" },
  { id: "high", label: "High (0.12mm)", desc: "Smooth finish, takes longer" },
] as const;

const INFILL_LABELS: Record<number, string> = { 5: "Light", 10: "Standard", 15: "Standard+", 20: "Strong", 25: "Very strong" };

/** Material option passed down from the server page (MongoDB service config). */
export interface QuoteMaterialOption {
  id: string;
  label: string;
  ratePerGram: number | null;
  density?: number | null;
}

/** The server's pricing inputs, so the live estimate matches the stored one. */
export interface QuotePricingSettings {
  hourlyRate: number;
  timeMultipliers: Record<string, number>;
}

/** File.arrayBuffer is missing in some older browsers; FileReader works everywhere. */
function readFileBytes(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === "function") return file.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function formatPrice(aud: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(aud);
}

export default function QuoteRequestForm({
  materials,
  pricing,
}: {
  materials: QuoteMaterialOption[];
  pricing: QuotePricingSettings;
}): ReactElement {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverEstimate, setServerEstimate] = useState<ServerEstimate | null>(null);

  const [material, setMaterial] = useState(materials[0]?.id ?? "PLA");
  const [quality, setQuality] = useState("standard");
  const [infill, setInfill] = useState(15);
  const [scale, setScale] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [geometry, setGeometry] = useState<StlGeometry | null>(null);
  const [fileNote, setFileNote] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [postcode, setPostcode] = useState("");
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [deliveryNote, setDeliveryNote] = useState<string | null>(null);
  const [deliveryChoice, setDeliveryChoice] = useState<DeliveryOptionId>("pickup");

  const selectedMaterial = materials.find((m) => m.id === material);

  // Measure the model once per file; option changes only re-run the cheap maths.
  const onFileChange = async (file: File | null) => {
    setSelectedFile(file);
    setGeometry(null);
    setFileNote(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".stl")) {
      setFileNote("Instant pricing works with STL files. I'll price this one by hand after you send it.");
      return;
    }
    const measured = measureStl(new Uint8Array(await readFileBytes(file)));
    if (!measured) setFileNote("I couldn't read this STL's shape automatically. Send it anyway and I'll price it by hand.");
    setGeometry(measured);
  };

  const estimate = useMemo(() => {
    if (!geometry || selectedMaterial?.ratePerGram == null) return null;
    return estimatePrint(geometry, {
      quantity,
      infill,
      scalePercent: scale,
      timeMultiplier: pricing.timeMultipliers[quality] ?? 1,
      ratePerGram: selectedMaterial.ratePerGram,
      hourlyRate: pricing.hourlyRate,
      densityGPerCm3: selectedMaterial.density,
    });
  }, [geometry, selectedMaterial, quantity, infill, scale, quality, pricing]);

  // Delivery prices follow the parcel size and weight, so they refresh when
  // the estimate changes. The short delay stops a request on every slider tick.
  useEffect(() => {
    if (!/^\d{4}$/.test(postcode)) {
      setDeliveryOptions([]);
      setDeliveryNote(null);
      return;
    }
    if (!estimate) {
      setDeliveryOptions([{ id: "pickup", method: "pickup", label: "Pickup in Frankston", price: 0 }]);
      setDeliveryNote("Upload an STL to see postage prices. I'll add delivery to your quote otherwise.");
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const params = new URLSearchParams({
        postcode,
        x: String(estimate.boundingBoxMm.x || 1),
        y: String(estimate.boundingBoxMm.y || 1),
        z: String(estimate.boundingBoxMm.z || 1),
        grams: String(estimate.gramsEach),
        quantity: String(quantity),
      });
      try {
        const res = await fetch(`/api/shipping/estimate?${params}`, { signal: controller.signal });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setDeliveryOptions(data.options);
        setDeliveryNote(data.postalUnavailable);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setDeliveryOptions([{ id: "pickup", method: "pickup", label: "Pickup in Frankston", price: 0 }]);
        setDeliveryNote("Couldn't get delivery prices right now. I'll add delivery to your quote.");
      }
    }, 400);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [postcode, estimate, quantity]);

  // If the chosen option disappears (e.g. new postcode isn't local), fall back to pickup.
  const chosen = deliveryOptions.find((o) => o.id === deliveryChoice) ?? null;
  const effectiveChoice: DeliveryOptionId = chosen ? deliveryChoice : "pickup";
  const total = estimate ? estimate.priceAud + (chosen?.price ?? 0) : null;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("submitting");
    setErrorMessage(null);
    setSuccessMessage(null);
    setServerEstimate(null);

    const form = event.currentTarget;
    const value = (name: string) => (form.querySelector(`[name="${name}"]`) as HTMLInputElement | null)?.value || "";
    const formData = new FormData();
    formData.set("name", value("name"));
    formData.set("email", value("email"));
    formData.set("suburb", value("suburb"));
    formData.set("postcode", postcode);
    formData.set("deliveryOption", effectiveChoice);
    formData.set("material", material);
    formData.set("customMaterial", value("customMaterial"));
    formData.set("quantity", String(quantity));
    formData.set("needsNextDay", value("needsNextDay") || "no");
    formData.set("notes", value("notes"));
    formData.set("quality", quality);
    formData.set("infill", String(infill));
    formData.set("scalePercent", String(scale));
    if (selectedFile) formData.set("modelFile", selectedFile);

    try {
      const response = await fetch("/api/3d-printing-quote", { method: "POST", body: formData });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormStatus("error");
        setErrorMessage(payload.error || "Could not submit the quote request. Please check the form and try again.");
        return;
      }
      setFormStatus("success");
      setSuccessMessage(
        `Sent. Your quote number is ${payload.requestId}. I'll check the file and email you the final price with a payment link.`,
      );
      setServerEstimate(payload.estimate ?? null);
    } catch {
      setFormStatus("error");
      setErrorMessage("Something went wrong while sending the quote request. Please try again.");
    }
  };

  return (
    <form className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900" onSubmit={onSubmit}>
      <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-5 dark:border-gray-800 dark:bg-gray-950/40 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Get a print quote</h2>
            <p className="max-w-2xl text-gray-600 dark:text-gray-400">
              Upload an STL and you&apos;ll see the price, including delivery, as you choose your options.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            STL + STP + OBJ
          </span>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {/* Laser engraving and milling don't have an upload-and-quote flow yet
            (the uploader and quote API are 3D-only), so point people to a message. */}
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Need laser engraving or CNC milling instead?{" "}
          <Link href="/contact" className="font-semibold text-primary hover:underline">
            Send me your DXF or SVG
          </Link>{" "}
          and I&apos;ll get back to you with a price.
        </p>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full">
            <label htmlFor="quote-model-file" className={labelClass}>
              Model file
            </label>
            <ModelDropZone onFileChange={onFileChange} acceptedTypes={[".stl", ".3mf", ".obj"]} maxSizeMb={25} />
            <input
              id="quote-model-file"
              type="file"
              ref={fileInputRef}
              name="modelFile"
              className="sr-only"
              accept={acceptedFileTypes}
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            />
            {fileNote && <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">{fileNote}</p>}
          </div>

          <div className={fieldShell}>
            <label htmlFor="quote-material" className={labelClass}>Material</label>
            <select id="quote-material" name="material" className={inputClass} value={material} onChange={(e) => setMaterial(e.target.value)}>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          {material === "other" && (
            <div className={fieldShell}>
              <label htmlFor="quote-custom-material" className={labelClass}>Describe material / colour</label>
              <input id="quote-custom-material" name="customMaterial" className={inputClass} placeholder="e.g. clear PETG, silver PLA" required />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">I&apos;ll source it if I don&apos;t stock it.</div>
            </div>
          )}
          <div className={fieldShell}>
            <label htmlFor="quote-quantity" className={labelClass}>Quantity</label>
            <input id="quote-quantity" name="quantity" type="number" min={1} max={1000} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className={inputClass} required />
          </div>

          <div className={fieldShell}>
            <span className={labelClass}>Print quality</span>
            <div className="flex flex-wrap gap-2">
              {QUALITY_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={quality === p.id}
                  onClick={() => setQuality(p.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    quality === p.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 text-gray-600 hover:border-primary/40 dark:border-gray-700 dark:text-gray-400"
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[10px] opacity-70">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-infill" className={labelClass}>Infill: {infill}% ({INFILL_LABELS[infill]})</label>
            <input id="quote-infill" type="range" min={5} max={25} step={5} value={infill} onChange={(e) => setInfill(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-scale" className={labelClass}>Scale: {scale}%</label>
            <input id="quote-scale" type="range" min={50} max={200} step={5} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-primary" />
          </div>

          <div className={fieldShell}>
            <label htmlFor="quote-name" className={labelClass}>Name</label>
            <input id="quote-name" name="name" className={inputClass} required />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-email" className={labelClass}>Email</label>
            <input id="quote-email" name="email" type="email" className={inputClass} required />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-suburb" className={labelClass}>Suburb</label>
            <input id="quote-suburb" name="suburb" className={inputClass} placeholder="Frankston, Seaford, Mornington..." required />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-postcode" className={labelClass}>Postcode</label>
            <input
              id="quote-postcode"
              name="postcode"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className={inputClass}
              placeholder="3199"
              required
            />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-next-day" className={labelClass}>Need it next day?</label>
            <select id="quote-next-day" name="needsNextDay" className={inputClass} defaultValue="no">
              <option value="no">No</option>
              <option value="yes">Yes, if possible</option>
            </select>
          </div>

          <div className="col-span-full rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <label htmlFor="quote-notes" className={labelClass}>Notes</label>
            <textarea id="quote-notes" name="notes" rows={3} className={inputClass} placeholder="What the part is for, colour, deadline, or anything else useful." />
          </div>
        </div>

        {/* Live price */}
        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5" aria-live="polite">
          {material === "other" ? (
            <p>Custom materials need a manual quote. I&apos;ll get back to you with a price.</p>
          ) : !estimate ? (
            <p className="text-gray-600 dark:text-gray-400">Upload an STL to see your price.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <span className="text-gray-500">Print</span>
                  <div className="text-2xl font-bold text-primary">{formatPrice(estimate.priceAud)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Plastic</span>
                  <div className="text-xl font-semibold">{estimate.totalGrams} g</div>
                </div>
                <div>
                  <span className="text-gray-500">Print time</span>
                  <div className="text-xl font-semibold">~{estimate.printHours} hrs</div>
                </div>
                <div>
                  <span className="text-gray-500">Size</span>
                  <div className="text-xl font-semibold">
                    {Math.round(estimate.boundingBoxMm.x)} × {Math.round(estimate.boundingBoxMm.y)} × {Math.round(estimate.boundingBoxMm.z)} mm
                  </div>
                </div>
              </div>

              <fieldset className="mt-5">
                <legend className="mb-2 font-semibold">Delivery</legend>
                {deliveryOptions.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enter your postcode to see delivery options.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {deliveryOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                          effectiveChoice === option.id ? "border-primary bg-white dark:bg-gray-900" : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input type="radio" name="deliveryOption" value={option.id} checked={effectiveChoice === option.id} onChange={() => setDeliveryChoice(option.id)} className="accent-primary" />
                          {option.label}
                        </span>
                        <span className="font-semibold">{option.price === 0 ? "Free" : formatPrice(option.price)}</span>
                      </label>
                    ))}
                  </div>
                )}
                {deliveryNote && <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">{deliveryNote}</p>}
              </fieldset>

              {total != null && (
                <p className="mt-4 text-lg">
                  Estimated total: <strong>{formatPrice(total)}</strong>
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Worked out from your model&apos;s real volume. I&apos;ll confirm the final price after checking the file; you only pay once you&apos;ve seen it.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-gradient inline-flex items-center rounded-full px-6 py-3 text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-70" disabled={formStatus === "submitting"}>
            {formStatus === "submitting" ? "Sending..." : "Send for a final quote"}
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-400">No payment now. You&apos;ll get the final price by email.</div>
        </div>

        {successMessage && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-50" role="alert">
            <div>{successMessage}</div>
            {serverEstimate?.analysisAvailable && serverEstimate.estimatedPriceAud != null && (
              <div className="mt-2 text-sm">Checked estimate for the print: {formatPrice(serverEstimate.estimatedPriceAud)}</div>
            )}
            {serverEstimate && !serverEstimate.analysisAvailable && <div className="mt-2 text-sm">{serverEstimate.previewNote}</div>}
          </div>
        )}
        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-50" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </form>
  );
}
