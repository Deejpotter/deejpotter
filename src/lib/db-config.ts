/**
 * db-config.ts — Database-backed configuration store
 *
 * Replaces the old flat-file printing-materials.json with live,
 * admin-editable config stored in MongoDB.
 *
 * Collections used:
 * - settings  — global business hours, holidays, vacations, shipping
 * - service_configs — per-service-type materials, pricing, presets
 */

import { getCollection } from "./db";
import {
  SettingsDocSchema,
  ServiceConfigDocSchema,
  type ServiceType,
  type MaterialConfig,
  type ServiceSettings,
} from "./db-schemas";

// ─── Settings (Global Config) ───────────────────────────────────────

const DEFAULT_BUSINESS_HOURS = [
  { day: "monday",    start: "09:00", end: "17:00", closed: false },
  { day: "tuesday",   start: "09:00", end: "17:00", closed: false },
  { day: "wednesday", start: "09:00", end: "17:00", closed: false },
  { day: "thursday",  start: "09:00", end: "17:00", closed: false },
  { day: "friday",    start: "09:00", end: "17:00", closed: false },
  { day: "saturday",  start: "09:00", end: "12:00", closed: false },
  { day: "sunday",    start: "09:00", end: "17:00", closed: true },
];

const DEFAULT_SETTINGS = {
  _id: "global" as const,
  businessHours: DEFAULT_BUSINESS_HOURS,
  holidays: [],
  vacations: [],
  shipping: {
    localDeliveryRadiusKm: 30,
    localDeliveryCenterLat: -38.15,
    localDeliveryCenterLng: 145.13,
    freeLocalDelivery: true,
    freePickup: true,
  },
  updatedAt: new Date().toISOString(),
};

export async function getSettings() {
  const col = await getCollection("settings");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = await col.findOne({ _id: "global" } as any);
  if (!doc) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await col.insertOne(DEFAULT_SETTINGS as any);
    return DEFAULT_SETTINGS;
  }
  return SettingsDocSchema.parse(doc);
}

export async function updateSettings(
  patch: Partial<{
    businessHours: typeof DEFAULT_SETTINGS.businessHours;
    holidays: typeof DEFAULT_SETTINGS.holidays;
    vacations: typeof DEFAULT_SETTINGS.vacations;
    shipping: typeof DEFAULT_SETTINGS.shipping;
  }>,
) {
  const col = await getCollection("settings");
  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await col.findOneAndUpdate(
    { _id: "global" } as any,
    { $set: { ...patch, updatedAt: now } },
    { upsert: true, returnDocument: "after" },
  );
  if (!result) throw new Error("Failed to update settings");
  return SettingsDocSchema.parse(result);
}

// ─── Service Configs ────────────────────────────────────────────────

const DEFAULT_3D_MATERIALS: MaterialConfig[] = [
  {
    id: "PLA",
    label: "PLA",
    fullName: "PLA (Polylactic Acid)",
    ratePerGram: 0.18,
    density: 1.24,
    defaultLayerHeight: 0.2,
    defaultInfill: 15,
    description: "General-purpose filament. Easy to print, low warp.",
    colors: ["Black", "White", "Grey", "Blue", "Red", "Green", "Orange", "Yellow", "Purple", "Transparent"],
    suggested: true,
    enabled: true,
  },
  {
    id: "PETG",
    label: "PETG",
    fullName: "PETG (Polyethylene Terephthalate Glycol)",
    ratePerGram: 0.22,
    density: 1.27,
    defaultLayerHeight: 0.2,
    defaultInfill: 15,
    description: "Stronger and more durable than PLA. Good for functional parts.",
    colors: ["Black", "White", "Grey", "Blue", "Red", "Clear"],
    suggested: true,
    enabled: true,
  },
];

const DEFAULT_3D_SETTINGS: ServiceSettings = {
  hourlyRate: 5,
  currency: "AUD",
  qualityPresets: {
    draft: { label: "Draft", layerHeightMm: 0.3, timeMultiplier: 0.7, description: "Fast print, visible layer lines" },
    standard: { label: "Standard", layerHeightMm: 0.2, timeMultiplier: 1.0, description: "Good balance of speed and quality" },
    high: { label: "High", layerHeightMm: 0.12, timeMultiplier: 1.6, description: "Smooth finish, takes longer" },
  },
  infillPresets: {
    "5": { label: "5% (Light)", materialMultiplier: 0.6, description: "Minimal structure" },
    "10": { label: "10% (Standard)", materialMultiplier: 0.8, description: "Decent strength" },
    "15": { label: "15% (Standard+)", materialMultiplier: 1.0, description: "Best balance" },
    "20": { label: "20% (Strong)", materialMultiplier: 1.2, description: "Extra strength" },
    "25": { label: "25% (Very Strong)", materialMultiplier: 1.4, description: "Maximum strength" },
  },
  scaleRange: { min: 50, max: 200, step: 5, default: 100 },
  setupFee: 0,
};

const DEFAULT_LASER_MATERIALS: MaterialConfig[] = [
  {
    id: "plywood_3mm",
    label: "Plywood 3mm",
    fullName: "Plywood (3mm)",
    ratePerGram: null,
    density: null,
    description: "Standard laser plywood. Good for cutting and engraving.",
    colors: ["Natural"],
    suggested: true,
    enabled: true,
    compatibleServices: ["laser"],
  },
  {
    id: "plywood_6mm",
    label: "Plywood 6mm",
    fullName: "Plywood (6mm)",
    ratePerGram: null,
    density: null,
    description: "Thicker plywood. Multiple passes may be needed for cutting.",
    colors: ["Natural"],
    suggested: true,
    enabled: true,
    compatibleServices: ["laser"],
  },
  {
    id: "acrylic_3mm",
    label: "Acrylic 3mm",
    fullName: "Acrylic (3mm)",
    ratePerGram: null,
    density: null,
    description: "Clear or coloured acrylic sheet.",
    colors: ["Clear", "Black", "White"],
    suggested: true,
    enabled: true,
    compatibleServices: ["laser"],
  },
];

const DEFAULT_LASER_SETTINGS: ServiceSettings = {
  hourlyRate: 5,
  currency: "AUD",
  cutPricePerMm: 0.05,
  engravePricePerMm2: 0.001,
  setupFee: 5,
};

const DEFAULT_MILLING_MATERIALS: MaterialConfig[] = [
  {
    id: "wood_soft",
    label: "Softwood",
    fullName: "Softwood (Pine/Treated Pine)",
    ratePerGram: null,
    density: null,
    description: "Pine and other softwoods. Easy to mill, good for signs and basic parts.",
    colors: ["Natural"],
    suggested: true,
    enabled: true,
    compatibleServices: ["milling"],
  },
  {
    id: "wood_hard",
    label: "Hardwood",
    fullName: "Hardwood (Oak/Jarrah/Vic Ash)",
    ratePerGram: null,
    density: null,
    description: "Hardwoods for more durable milled parts.",
    colors: ["Natural"],
    suggested: true,
    enabled: true,
    compatibleServices: ["milling"],
  },
  {
    id: "acrylic_mill",
    label: "Acrylic",
    fullName: "Acrylic Sheet",
    ratePerGram: null,
    density: null,
    description: "Acrylic for milling. Clean edges, good for signs and panels.",
    colors: ["Clear", "Black", "White"],
    suggested: true,
    enabled: true,
    compatibleServices: ["milling"],
  },
];

const DEFAULT_MILLING_SETTINGS: ServiceSettings = {
  hourlyRate: 5,
  currency: "AUD",
  cutPricePerMm: 0.08,
  engravePricePerMm2: 0.002,
  setupFee: 10,
};

const SERVICE_DEFAULTS = {
  "3d_printing": {
    displayName: "3D Printing",
    materials: DEFAULT_3D_MATERIALS,
    settings: DEFAULT_3D_SETTINGS,
  },
  laser: {
    displayName: "Laser Engraving & Cutting",
    materials: DEFAULT_LASER_MATERIALS,
    settings: DEFAULT_LASER_SETTINGS,
  },
  milling: {
    displayName: "CNC Milling",
    materials: DEFAULT_MILLING_MATERIALS,
    settings: DEFAULT_MILLING_SETTINGS,
  },
} as const;

export async function getServiceConfig(serviceType: ServiceType) {
  const col = await getCollection("service_configs");
  const doc = await col.findOne({ serviceType });

  if (!doc) {
    const defaults = SERVICE_DEFAULTS[serviceType];
    const newDoc = {
      serviceType,
      enabled: true,
      displayName: defaults.displayName,
      materials: defaults.materials,
      settings: defaults.settings,
      updatedAt: new Date().toISOString(),
    };
    await col.insertOne(newDoc);
    return ServiceConfigDocSchema.parse(newDoc);
  }

  return ServiceConfigDocSchema.parse(doc);
}

export async function getAllServiceConfigs() {
  const types: ServiceType[] = ["3d_printing", "laser", "milling"];
  const result = await Promise.all(types.map((t) => getServiceConfig(t)));
  return result;
}

export async function updateServiceConfig(
  serviceType: ServiceType,
  patch: {
    enabled?: boolean;
    materials?: MaterialConfig[];
    settings?: Partial<ServiceSettings>;
  },
) {
  const col = await getCollection("service_configs");
  const now = new Date().toISOString();
  const update: Record<string, unknown> = { updatedAt: now };

  if (patch.enabled !== undefined) update.enabled = patch.enabled;
  if (patch.materials !== undefined) update.materials = patch.materials;
  if (patch.settings !== undefined) {
    // Merge settings instead of replacing
    const current = await getServiceConfig(serviceType);
    const merged = { ...current.settings, ...patch.settings };
    update.settings = merged;
  }

  const result = await col.findOneAndUpdate(
    { serviceType },
    { $set: update },
    { upsert: true, returnDocument: "after" },
  );
  if (!result) throw new Error("Failed to update service config");
  return ServiceConfigDocSchema.parse(result);
}

/**
 * Get all enabled materials for a service type (for customer-facing UI).
 */
export async function getEnabledMaterials(
  serviceType: ServiceType,
): Promise<MaterialConfig[]> {
  const config = await getServiceConfig(serviceType);
  return config.materials.filter((m) => m.enabled);
}

/**
 * Get a specific material by ID from a service type.
 */
export async function getMaterial(
  serviceType: ServiceType,
  materialId: string,
): Promise<MaterialConfig | undefined> {
  const config = await getServiceConfig(serviceType);
  return config.materials.find((m) => m.id === materialId);
}
