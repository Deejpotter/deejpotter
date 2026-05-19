import { getMaterialRate, getInfillPreset, getQualityPreset, getSettings } from "@/lib/printing-materials";

export interface BoundingBoxMm {
  x: number;
  y: number;
  z: number;
}

export interface QuoteAnalysis {
  fileKind: "stl" | "other";
  analysisAvailable: boolean;
  triangleCount?: number;
  boundingBoxMm?: BoundingBoxMm;
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

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

function round(value: number, places = 1): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function mm3ToCm3(value: number): number {
  return value / 1000;
}

function updateBounds(bounds: { min: Vector3; max: Vector3 } | null, vertex: Vector3) {
  if (!bounds) {
    return {
      min: { ...vertex },
      max: { ...vertex },
    };
  }

  bounds.min.x = Math.min(bounds.min.x, vertex.x);
  bounds.min.y = Math.min(bounds.min.y, vertex.y);
  bounds.min.z = Math.min(bounds.min.z, vertex.z);
  bounds.max.x = Math.max(bounds.max.x, vertex.x);
  bounds.max.y = Math.max(bounds.max.y, vertex.y);
  bounds.max.z = Math.max(bounds.max.z, vertex.z);
  return bounds;
}

function getBoundingBoxMm(bounds: { min: Vector3; max: Vector3 } | null): BoundingBoxMm | undefined {
  if (!bounds) return undefined;
  return {
    x: round(Math.max(0, bounds.max.x - bounds.min.x), 1),
    y: round(Math.max(0, bounds.max.y - bounds.min.y), 1),
    z: round(Math.max(0, bounds.max.z - bounds.min.z), 1),
  };
}

function isLikelyBinaryStl(buffer: Buffer): boolean {
  if (buffer.length < 84) return false;
  const triangleCount = buffer.readUInt32LE(80);
  return 84 + triangleCount * 50 === buffer.length;
}

function parseBinaryStl(buffer: Buffer): { triangleCount: number; boundingBoxMm?: BoundingBoxMm } | null {
  if (!isLikelyBinaryStl(buffer)) return null;

  const triangleCount = buffer.readUInt32LE(80);
  let bounds: { min: Vector3; max: Vector3 } | null = null;

  for (let i = 0; i < triangleCount; i += 1) {
    const offset = 84 + i * 50 + 12;
    for (let v = 0; v < 3; v += 1) {
      const vertexOffset = offset + v * 12;
      const vertex = {
        x: buffer.readFloatLE(vertexOffset),
        y: buffer.readFloatLE(vertexOffset + 4),
        z: buffer.readFloatLE(vertexOffset + 8),
      };
      bounds = updateBounds(bounds, vertex);
    }
  }

  return { triangleCount, boundingBoxMm: getBoundingBoxMm(bounds) };
}

function parseAsciiStl(buffer: Buffer): { triangleCount: number; boundingBoxMm?: BoundingBoxMm } | null {
  const text = buffer.toString("utf8");
  if (!text.trimStart().toLowerCase().startsWith("solid")) return null;

  const vertexMatches = Array.from(
    text.matchAll(
      /vertex\s+(-?\d*\.?\d+(?:[eE][+-]?\d+)?)\s+(-?\d*\.?\d+(?:[eE][+-]?\d+)?)\s+(-?\d*\.?\d+(?:[eE][+-]?\d+)?)/g
    )
  );
  if (vertexMatches.length < 3) return null;

  let bounds: { min: Vector3; max: Vector3 } | null = null;
  for (const match of vertexMatches) {
    const vertex = {
      x: Number(match[1]),
      y: Number(match[2]),
      z: Number(match[3]),
    };
    bounds = updateBounds(bounds, vertex);
  }

  return {
    triangleCount: Math.floor(vertexMatches.length / 3),
    boundingBoxMm: getBoundingBoxMm(bounds),
  };
}

export async function analyzeQuoteFile(
  file: File,
  quantity: number,
  material: string,
  params?: {
    quality?: "draft" | "standard" | "high";
    infill?: number;
    scalePercent?: number;
  }
): Promise<QuoteAnalysis> {
  const lowerName = (file.name || "").toLowerCase();
  if (!lowerName.endsWith(".stl")) {
    return {
      fileKind: "other",
      analysisAvailable: false,
      previewNote: "Automatic preflight is available for STL files first. Other formats still go through the full quote workflow.",
      confidence: "low",
    };
  }

  // "Other" material means no automatic pricing — needs manual quote
  if (material === "other") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsed = parseBinaryStl(buffer) ?? parseAsciiStl(buffer);
    return {
      fileKind: "stl",
      analysisAvailable: false,
      triangleCount: parsed?.triangleCount,
      boundingBoxMm: parsed?.boundingBoxMm,
      needsManualQuote: true,
      previewNote: "This material needs a custom quote. I'll review the file and get back to you with pricing.",
      confidence: "low",
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const parsed = parseBinaryStl(buffer) ?? parseAsciiStl(buffer);

  if (!parsed?.boundingBoxMm) {
    return {
      fileKind: "stl",
      analysisAvailable: false,
      previewNote: "The STL uploaded successfully, but the automatic preview could not read reliable geometry from it.",
      confidence: "low",
    };
  }

  const bboxVolumeMm3 = parsed.boundingBoxMm.x * parsed.boundingBoxMm.y * parsed.boundingBoxMm.z;
  const bboxVolumeCm3 = mm3ToCm3(bboxVolumeMm3);
  const estimatedMaterialGrams = Math.max(2, bboxVolumeCm3 * 0.16 * quantity);
  const complexityHours = parsed.triangleCount / 9000;
  const sizeHours = bboxVolumeCm3 / 45;
  const estimatedPrintHours = Math.max(0.5, (0.45 + sizeHours + complexityHours) * quantity);

  // Config-driven pricing
  const perGram = getMaterialRate(material) ?? 0.2;
  const { hourlyRate } = getSettings();

  // Apply interactive builder multipliers
  const qualityKey = params?.quality || "standard";
  const infillVal = params?.infill || 15;
  const scaleVal = (params?.scalePercent || 100) / 100;

  const qualityPreset = getQualityPreset(qualityKey);
  const infillPreset = getInfillPreset(String(infillVal));

  const timeMultiplier = qualityPreset?.timeMultiplier ?? 1.0;
  const materialMultiplier = infillPreset?.materialMultiplier ?? 1.0;

  // Scale affects volume cubically
  const scaleVolumeMultiplier = scaleVal ** 3;

  // Adjust material by infill + scale
  const adjustedMaterialGrams = estimatedMaterialGrams * materialMultiplier * scaleVolumeMultiplier;
  // Adjust time by quality + scale
  const adjustedPrintHours = estimatedPrintHours * timeMultiplier * (scaleVal ** 0.8);

  const estimatedPriceAud = Math.max(5, 8 + adjustedMaterialGrams * perGram + adjustedPrintHours * hourlyRate);

  return {
    fileKind: "stl",
    analysisAvailable: true,
    triangleCount: parsed.triangleCount,
    boundingBoxMm: parsed.boundingBoxMm,
    estimatedMaterialGrams: round(adjustedMaterialGrams, 1),
    estimatedPrintHours: round(adjustedPrintHours, 1),
    estimatedPriceAud: round(estimatedPriceAud, 2),
    previewNote:
      "This is an automatic starting estimate based on STL geometry and requested quantity. Final quoting can still change for strength, finish, orientation, supports, and delivery.",
    confidence: "medium",
  };
}
