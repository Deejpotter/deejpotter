"use client";

import { ReactElement, useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

const ModelDropZone = dynamic(() => import("@/components/ModelDropZone/ModelDropZone"), { ssr: false });

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
  needsManualQuote?: boolean;
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

// Builder presets — mirrors config/printing-materials.json
const QUALITY_PRESETS = [
  { id: "draft", label: "Draft (0.3mm)", timeMul: 0.7, desc: "Fast print, visible layer lines" },
  { id: "standard", label: "Standard (0.2mm)", timeMul: 1.0, desc: "Good balance of speed and quality" },
  { id: "high", label: "High (0.12mm)", timeMul: 1.6, desc: "Smooth finish, takes longer" },
] as const;

const INFILL_PRESETS = [
  { id: "5", label: "5% — Light", matMul: 0.6 },
  { id: "10", label: "10% — Standard", matMul: 0.8 },
  { id: "15", label: "15% — Standard+", matMul: 1.0 },
  { id: "20", label: "20% — Strong", matMul: 1.2 },
  { id: "25", label: "25% — Very Strong", matMul: 1.4 },
] as const;

// Material pricing lookup for client-side estimate
const MATERIAL_RATES: Record<string, number> = {
  PLA: 0.18,
  PETG: 0.22,
  ABS: 0.24,
  TPU: 0.28,
};

function computeClientEstimate(params: {
  material: string;
  quantity: number;
  quality: string;
  infill: number;
  scale: number;
}): { price: number; hours: number; grams: number } | null {
  if (!params.material || params.material === "other" || params.material === "Unsure") return null;

  const perGram = MATERIAL_RATES[params.material] ?? 0.2;
  const qualityPreset = QUALITY_PRESETS.find((q) => q.id === params.quality);
  const infillPreset = INFILL_PRESETS.find((i) => Number(i.id) === params.infill);
  const scaleVal = params.scale / 100;

  // Rough guestimates based on typical print scenarios
  const baseGrams = 15 * params.quantity; // placeholder until file is analysed
  const baseHours = 3 * params.quantity;

  const timeMul = qualityPreset?.timeMul ?? 1.0;
  const matMul = infillPreset?.matMul ?? 1.0;
  const scaleVol = scaleVal ** 3;

  const grams = baseGrams * matMul * scaleVol;
  const hours = baseHours * timeMul * (scaleVal ** 0.8);
  const price = 8 + grams * perGram + hours * 5;

  return { price: Math.round(price * 100) / 100, hours: Math.round(hours * 10) / 10, grams: Math.round(grams * 10) / 10 };
}

function formatPrice(aud: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(aud);
}

export default function QuoteRequestForm(): ReactElement {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);

  // Interactive builder state
  const [material, setMaterial] = useState("PLA");
  const [showCustomMaterial, setShowCustomMaterial] = useState(false);
  const [quality, setQuality] = useState("standard");
  const [infill, setInfill] = useState(15);
  const [scale, setScale] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [serviceType, setServiceType] = useState<"3d_printing" | "laser" | "milling">("3d_printing");
  const [laserThickness, setLaserThickness] = useState(3);
  const [laserOp, setLaserOp] = useState<"cut" | "engrave" | "both">("cut");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clientEstimate = useMemo(
    () => computeClientEstimate({ material, quantity, quality, infill, scale }),
    [material, quantity, quality, infill, scale]
  );

  const handleMaterialChange = (val: string) => {
    setMaterial(val);
    setShowCustomMaterial(val === "other");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("submitting");
    setErrorMessage(null);
    setSuccessMessage(null);
    setEstimate(null);

    const form = event.currentTarget;
    const formData = new FormData();
    // Build form data manually
    formData.set("name", (form.querySelector('[name="name"]') as HTMLInputElement)?.value || "");
    formData.set("email", (form.querySelector('[name="email"]') as HTMLInputElement)?.value || "");
    formData.set("suburb", (form.querySelector('[name="suburb"]') as HTMLInputElement)?.value || "");
    formData.set("material", material);
    formData.set("quantity", String(quantity));
    formData.set("localFulfilment", (form.querySelector('[name="localFulfilment"]') as HTMLSelectElement)?.value || "no");
    formData.set("needsNextDay", (form.querySelector('[name="needsNextDay"]') as HTMLSelectElement)?.value || "no");
    formData.set("notes", (form.querySelector('[name="notes"]') as HTMLTextAreaElement)?.value || "");
    formData.set("quality", quality);
    formData.set("infill", String(infill));
    formData.set("scalePercent", String(scale));

    if (selectedFile) {
      formData.set("modelFile", selectedFile);
    }

    try {
      const response = await fetch("/api/3d-printing-quote", { method: "POST", body: formData });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFormStatus("error");
        setErrorMessage(payload.error || "Could not submit the quote request. Please check the form and try again.");
        return;
      }

      setFormStatus("success");
      setSuccessMessage(`${payload.message || "Quote request sent."}${payload.requestId ? ` Request ID: ${payload.requestId}.` : ""}`);
      setEstimate(payload.estimate ?? null);
      form.reset();
      setQuality("standard");
      setInfill(15);
      setScale(100);
      setMaterial("PLA");
      setShowCustomMaterial(false);
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
            <h2 className="mb-2 text-3xl font-bold">
              {serviceType === "3d_printing"
                ? "Request a print quote"
                : serviceType === "laser"
                  ? "Request a laser quote"
                  : "Request a milling quote"}
            </h2>
            <p className="max-w-2xl text-gray-600 dark:text-gray-400">
              Upload your file, choose your options, and get an instant estimate.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            {serviceType === "3d_printing" ? "STL + STP + OBJ" : "DXF + SVG"}
          </span>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {/* Service type selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: "3d_printing", label: "🖨️ 3D Printing" },
            { id: "laser", label: "🔆 Laser" },
            { id: "milling", label: "⚙️ CNC Milling" },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setServiceType(s.id as typeof serviceType)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                serviceType === s.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/30"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Contact info */}
          <div className={fieldShell}>
            <label htmlFor="quote-name" className={labelClass}>Name</label>
            <input id="quote-name" name="name" className={inputClass} required />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-email" className={labelClass}>Email</label>
            <input id="quote-email" name="email" type="email" className={inputClass} required />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-suburb" className={labelClass}>Suburb / area</label>
            <input id="quote-suburb" name="suburb" className={inputClass} placeholder="Frankston, Seaford, Mornington..." required />
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-material" className={labelClass}>Material</label>
            <select id="quote-material" name="material" className={selectClass} value={material} onChange={(e) => handleMaterialChange(e.target.value)}>
              <option value="PLA">PLA — General purpose</option>
              <option value="PETG">PETG — Strong, durable</option>
              <option value="ABS">ABS — Tough, heat-resistant</option>
              <option value="TPU">TPU — Flexible</option>
              <option value="carbon_fiber_pla">Carbon Fiber PLA — Stiff</option>
              <option value="PC">Polycarbonate — Extreme strength</option>
              <option value="ASA">ASA — UV-resistant</option>
              <option value="Nylon">Nylon — Very strong</option>
              <option value="wood_pla">Wood-Filled PLA</option>
              <option value="other">Other (I&apos;ll describe it)</option>
            </select>
          </div>

          {/* Custom material field */}
          {showCustomMaterial && (
            <div className={fieldShell}>
              <label htmlFor="quote-custom-material" className={labelClass}>Describe material / colour</label>
              <input id="quote-custom-material" name="customMaterial" className={inputClass} placeholder="e.g. 'Clear PETG', 'Neon green PLA', 'I need metallic silver filament'" required />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">I&apos;ll source it if I don&apos;t stock it.</div>
            </div>
          )}

          <div className={fieldShell}>
            <label htmlFor="quote-quantity" className={labelClass}>Quantity</label>
            <input id="quote-quantity" name="quantity" type="number" min={1} max={1000} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className={inputClass} required />
          </div>
          {/* 3D Preview Drop Zone */}
          <div className="col-span-full">
            <label htmlFor="quote-model-file" className={labelClass}>
              Model file
            </label>
            <ModelDropZone
              onFileChange={setSelectedFile}
              acceptedTypes={
                serviceType === "3d_printing"
                  ? [".stl", ".3mf", ".obj"]
                  : [".dxf", ".svg"]
              }
              maxSizeMb={25}
            />
            {/* Hidden file input for form submission */}
            <input
              id="quote-model-file"
              type="file"
              ref={fileInputRef}
              name="modelFile"
              className="sr-only"
              accept={acceptedFileTypes}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedFile(file);
              }}
            />
            <input type="hidden" name="serviceType" value={serviceType} />
          </div>

          {/* ── Laser / Milling options ── */}
          {serviceType !== "3d_printing" && (
            <>
              <div className={fieldShell}>
                <label className={labelClass}>Material thickness (mm)</label>
                <select
                  value={laserThickness}
                  onChange={(e) => setLaserThickness(Number(e.target.value))}
                  className={selectClass}
                >
                  <option value={3}>3mm</option>
                  <option value={5}>5mm</option>
                  <option value={6}>6mm</option>
                  <option value={9}>9mm</option>
                  <option value={12}>12mm</option>
                </select>
              </div>
              <div className={fieldShell}>
                <label className={labelClass}>Operation</label>
                <select
                  value={laserOp}
                  onChange={(e) => setLaserOp(e.target.value as "cut" | "engrave" | "both")}
                  className={selectClass}
                >
                  <option value="cut">Cut only</option>
                  <option value="engrave">Engrave only</option>
                  <option value="both">Cut + Engrave</option>
                </select>
              </div>
            </>
          )}

          {/* ── Interactive Builder (3D printing only) ── */}
          {serviceType === "3d_printing" && (
            <>
          {/* Quality */}
          <div className={fieldShell}>
            <label className={labelClass}>Print quality</label>
            <div className="flex flex-wrap gap-2">
              {QUALITY_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setQuality(p.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    quality === p.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/40"
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[10px] opacity-70">{p.desc}</div>
                </button>
              ))}
            </div>
            <input type="hidden" name="quality" value={quality} />
          </div>

          {/* Infill */}
          <div className={fieldShell}>
            <label className={labelClass}>Infill density</label>
            <input type="range" min={5} max={25} step={5} value={infill} onChange={(e) => setInfill(Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              {INFILL_PRESETS.map((p) => (
                <span key={p.id} className={Number(p.id) === infill ? "font-bold text-primary" : ""}>{p.label.split(" —")[0]}</span>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">{INFILL_PRESETS.find((p) => Number(p.id) === infill)?.label.split(" —")[1]}</div>
            <input type="hidden" name="infill" value={infill} />
          </div>

          {/* Scale */}
          <div className={fieldShell}>
            <label className={labelClass}>Scale: {scale}%</label>
            <input type="range" min={50} max={200} step={5} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50%</span><span>100%</span><span>200%</span>
            </div>
            <input type="hidden" name="scalePercent" value={scale} />
          </div>
          </>
          )}

          {/* Delivery */}
          <div className={fieldShell}>
            <label htmlFor="quote-local" className={labelClass}>Local delivery / pickup</label>
            <select id="quote-local" name="localFulfilment" className={selectClass} defaultValue="yes">
              <option value="yes">Yes — local</option>
              <option value="no">No — not local</option>
              <option value="unsure">Not sure</option>
            </select>
          </div>
          <div className={fieldShell}>
            <label htmlFor="quote-next-day" className={labelClass}>Need next day?</label>
            <select id="quote-next-day" name="needsNextDay" className={selectClass} defaultValue="no">
              <option value="no">No</option>
              <option value="yes">Yes, if viable</option>
            </select>
          </div>

          {/* Notes */}
          <div className="md:col-span-2 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <label htmlFor="quote-notes" className={labelClass}>Notes</label>
            <textarea id="quote-notes" name="notes" rows={5} className={textareaClass} placeholder="Part purpose, dimensions, colour preference, deadline, or anything else useful." />
          </div>
        </div>

        {/* Live Estimate */}
        {clientEstimate && (
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <h3 className="font-semibold text-lg mb-2">Live estimate (before upload)</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Estimated price</span>
                <div className="text-2xl font-bold text-primary">{formatPrice(clientEstimate.price)}</div>
              </div>
              <div>
                <span className="text-gray-500">Print time</span>
                <div className="text-xl font-semibold">~{clientEstimate.hours} hrs</div>
              </div>
              <div>
                <span className="text-gray-500">Material</span>
                <div className="text-xl font-semibold">~{clientEstimate.grams}g</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This adjusts as you change options. Final price after file analysis may differ.</p>
          </div>
        )}

        {material === "other" && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
            Custom materials need a manual quote. I&apos;ll review your request and get back to you with pricing.
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70" disabled={formStatus === "submitting"}>
            {formStatus === "submitting" ? "Sending request..." : "Request quote"}
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-400">Large or urgent jobs may still need manual confirmation.</div>
        </div>

        {/* Success / Error messages */}
        {successMessage && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-50" role="alert">
            <div>{successMessage}</div>
            {estimate && (
              <div className="mt-4 border-t border-emerald-200 pt-4 dark:border-emerald-900/60">
                <div className="mb-2 font-semibold">Automatic preflight estimate</div>
                {estimate.analysisAvailable && !estimate.needsManualQuote ? (
                  <>
                    <div className="mb-1 text-sm">Estimated price: ${estimate.estimatedPriceAud?.toFixed(2)}</div>
                    <div className="mb-1 text-sm">Print time: {estimate.estimatedPrintHours} hrs</div>
                    <div className="mb-1 text-sm">Material: {estimate.estimatedMaterialGrams}g</div>
                    {estimate.boundingBoxMm && <div className="mb-1 text-sm">Size: {estimate.boundingBoxMm.x} × {estimate.boundingBoxMm.y} × {estimate.boundingBoxMm.z} mm</div>}
                  </>
                ) : (
                  <div className="mb-1 text-sm">{estimate.needsManualQuote ? "Custom material — manual quote needed." : "Automatic preflight was not available for this file."}</div>
                )}
                <div className="mt-2 text-sm text-emerald-900/80 dark:text-emerald-100/80">{estimate.previewNote}</div>
              </div>
            )}
          </div>
        )}
        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950 shadow-sm dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-50" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </form>
  );
}


