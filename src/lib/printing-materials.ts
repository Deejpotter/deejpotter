/**
 * printing-materials.ts — Shared config loader for 3D printing materials
 *
 * Reads from config/printing-materials.json so materials can be edited
 * without touching code. Provides typesafe lookups and fallbacks.
 */

import fs from "node:fs";
import path from "node:path";

export interface MaterialConfig {
  id: string;
  label: string;
  fullName: string;
  ratePerGram: number | null;
  density_g_per_cm3: number | null;
  defaultLayerHeight: number;
  defaultInfill: number;
  description: string;
  colors: string[];
  suggested: boolean;
}

export interface QualityPreset {
  label: string;
  layerHeightMm: number;
  timeMultiplier: number;
  description: string;
}

export interface InfillPreset {
  label: string;
  materialMultiplier: number;
  description: string;
}

export interface ScaleRange {
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface SettingsConfig {
  defaultQuality: string;
  defaultInfill: number;
  defaultScalePercent: number;
  hourlyRate: number;
  currency: string;
  qualityPresets: Record<string, QualityPreset>;
  infillPresets: Record<string, InfillPreset>;
  scaleRange: ScaleRange;
}

export interface PrintingMaterialsConfig {
  description: string;
  materials: MaterialConfig[];
  settings: SettingsConfig;
}

// Default fallback materials if config file can't be read
const FALLBACK_MATERIALS: PrintingMaterialsConfig = {
  description: "Fallback configuration",
  materials: [
    { id: "PLA", label: "PLA", fullName: "PLA (Polylactic Acid)", ratePerGram: 0.18, density_g_per_cm3: 1.24, defaultLayerHeight: 0.2, defaultInfill: 15, description: "", colors: [], suggested: true },
    { id: "PETG", label: "PETG", fullName: "PETG", ratePerGram: 0.22, density_g_per_cm3: 1.27, defaultLayerHeight: 0.2, defaultInfill: 15, description: "", colors: [], suggested: true },
    { id: "ABS", label: "ABS", fullName: "ABS (Acrylonitrile Butadiene Styrene)", ratePerGram: 0.24, density_g_per_cm3: 1.04, defaultLayerHeight: 0.2, defaultInfill: 20, description: "", colors: [], suggested: true },
    { id: "TPU", label: "TPU", fullName: "TPU (Thermoplastic Polyurethane)", ratePerGram: 0.28, density_g_per_cm3: 1.21, defaultLayerHeight: 0.2, defaultInfill: 15, description: "", colors: [], suggested: true },
    { id: "other", label: "Other", fullName: "Custom material", ratePerGram: null, density_g_per_cm3: null, defaultLayerHeight: 0.2, defaultInfill: 15, description: "", colors: [], suggested: true },
  ],
  settings: {
    defaultQuality: "standard", defaultInfill: 15, defaultScalePercent: 100,
    hourlyRate: 5.00, currency: "AUD",
    qualityPresets: {
      draft: { label: "Draft", layerHeightMm: 0.3, timeMultiplier: 0.7, description: "" },
      standard: { label: "Standard", layerHeightMm: 0.2, timeMultiplier: 1.0, description: "" },
      high: { label: "High", layerHeightMm: 0.12, timeMultiplier: 1.6, description: "" },
    },
    infillPresets: {
      "5": { label: "5%", materialMultiplier: 0.6, description: "" },
      "10": { label: "10%", materialMultiplier: 0.8, description: "" },
      "15": { label: "15%", materialMultiplier: 1.0, description: "" },
      "20": { label: "20%", materialMultiplier: 1.2, description: "" },
      "25": { label: "25%", materialMultiplier: 1.4, description: "" },
    },
    scaleRange: { min: 50, max: 200, step: 5, default: 100 },
  },
};

let cached: PrintingMaterialsConfig | null = null;

function resolveConfigPath(): string {
  // Try multiple locations in order
  const candidates = [
    path.join(process.cwd(), "config", "printing-materials.json"),
    path.join(process.cwd(), "..", "config", "printing-materials.json"),
  ];
  // Allow override via env
  if (process.env.PRINTING_MATERIALS_CONFIG) {
    candidates.unshift(process.env.PRINTING_MATERIALS_CONFIG);
  }
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return candidates[0]!;
}

export function loadConfig(): PrintingMaterialsConfig {
  if (cached) return cached;

  const configPath = resolveConfigPath();
  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(raw) as PrintingMaterialsConfig;
      cached = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn(`Could not load materials config from ${configPath}:`, err);
  }

  // Fallback
  cached = FALLBACK_MATERIALS;
  return cached;
}

export function getMaterial(materialId: string): MaterialConfig | undefined {
  return loadConfig().materials.find((m) => m.id === materialId);
}

export function getMaterialRate(materialId: string): number | null {
  const material = getMaterial(materialId);
  return material?.ratePerGram ?? null;
}

export function getMaterialIds(): string[] {
  return loadConfig().materials.map((m) => m.id);
}

export function getMaterialLabels(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const m of loadConfig().materials) {
    result[m.id] = m.label;
  }
  return result;
}

export function getQualityPreset(key: string): QualityPreset | undefined {
  return loadConfig().settings.qualityPresets[key];
}

export function getInfillPreset(key: string): InfillPreset | undefined {
  return loadConfig().settings.infillPresets[key];
}

export function getSettings(): SettingsConfig {
  return loadConfig().settings;
}

// Invalidate cache (useful for testing)
export function clearCache(): void {
  cached = null;
}
