/**
 * quote-analysis.ts — The estimate stored with a submitted 3D printing quote
 *
 * This is the server's copy of the live estimate the customer saw in the
 * browser: the same STL measurements (stl-geometry) and the same maths
 * (print-estimate), but run on the uploaded file with the rates from the
 * database. It's what Deej sees on the quote board and what "Send quote"
 * prefills, so it has to be the trustworthy version, not the browser's.
 */

import { getQualityPreset, getSettings, getMaterial, getMaterialRate } from "@/lib/printing-materials";
import { estimatePrint } from "@/lib/print-estimate";
import { measureStl, type BoundingBoxMm } from "@/lib/stl-geometry";

export type { BoundingBoxMm };

export interface QuoteAnalysis {
  fileKind: "stl" | "other";
  analysisAvailable: boolean;
  triangleCount?: number;
  boundingBoxMm?: BoundingBoxMm;
  /** Plastic for the whole order (all copies). */
  estimatedMaterialGrams?: number;
  estimatedPrintHours?: number;
  estimatedPriceAud?: number;
  previewNote: string;
  confidence: "low" | "medium";
  /**
   * If material is "other", no automatic price estimate is possible.
   */
  needsManualQuote?: boolean;
}

export async function analyzeQuoteFile(
  file: File,
  quantity: number,
  material: string,
  params?: {
    quality?: "draft" | "standard" | "high";
    infill?: number;
    scalePercent?: number;
    /** Rate from the MongoDB service config; falls back to the JSON config */
    ratePerGram?: number | null;
    /** Density from the MongoDB service config; falls back to the JSON config */
    density?: number | null;
  }
): Promise<QuoteAnalysis> {
  const lowerName = (file.name || "").toLowerCase();
  if (!lowerName.endsWith(".stl")) {
    return {
      fileKind: "other",
      analysisAvailable: false,
      previewNote: "Automatic pricing works with STL files. I'll price this file by hand.",
      confidence: "low",
    };
  }

  const geometry = measureStl(new Uint8Array(await file.arrayBuffer()));
  if (!geometry) {
    return {
      fileKind: "stl",
      analysisAvailable: false,
      previewNote: "The STL uploaded, but I couldn't read its shape automatically. I'll price it by hand.",
      confidence: "low",
    };
  }

  // "Other" material means no automatic pricing, but the size still helps Deej.
  if (material === "other") {
    return {
      fileKind: "stl",
      analysisAvailable: false,
      triangleCount: geometry.triangleCount,
      boundingBoxMm: geometry.boundingBoxMm,
      needsManualQuote: true,
      previewNote: "This material needs a custom quote. I'll review the file and get back to you with pricing.",
      confidence: "low",
    };
  }

  const { hourlyRate } = getSettings();
  const estimate = estimatePrint(geometry, {
    quantity,
    infill: params?.infill ?? 15,
    scalePercent: params?.scalePercent ?? 100,
    timeMultiplier: getQualityPreset(params?.quality || "standard")?.timeMultiplier ?? 1,
    ratePerGram: params?.ratePerGram ?? getMaterialRate(material) ?? 0.2,
    hourlyRate,
    densityGPerCm3: params?.density ?? getMaterial(material)?.density_g_per_cm3,
  });

  return {
    fileKind: "stl",
    analysisAvailable: true,
    triangleCount: geometry.triangleCount,
    boundingBoxMm: estimate.boundingBoxMm,
    estimatedMaterialGrams: estimate.totalGrams,
    estimatedPrintHours: estimate.printHours,
    estimatedPriceAud: estimate.priceAud,
    previewNote:
      "Worked out from your model's real volume and surface. I'll confirm the final price after checking orientation, supports and finish.",
    confidence: "medium",
  };
}
