// @ts-nocheck — Zod v4 type defs differ at build time; runtime works
/**
 * db-schemas.ts — Zod validation schemas for all MongoDB collections
 *
 * Every write to the database goes through these schemas.
 */

import { z } from "zod";

// ─── Common Enums ───────────────────────────────────────────────────

export const ServiceTypeEnum = z.enum(["3d_printing", "laser", "milling"]);
export type ServiceType = z.infer<typeof ServiceTypeEnum>;

export const QuoteStatusEnum = z.enum([
  "new",
  "reviewing",
  "quoted",
  "awaiting_payment",
  "approved",
  "in_progress",
  "ready",
  "completed",
  "declined",
  "cancelled",
]);
export type QuoteStatus = z.infer<typeof QuoteStatusEnum>;

export const DeliveryMethodEnum = z.enum(["pickup", "local_delivery", "shipped"]);
export type DeliveryMethod = z.infer<typeof DeliveryMethodEnum>;

export const DayOfWeekEnum = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

// ─── Business Hours ─────────────────────────────────────────────────

export const BusinessHourDaySchema = z.object({
  day: DayOfWeekEnum,
  start: z.string().regex(/^\d{2}:\d{2}$/, "Expected HH:MM format"),
  end: z.string().regex(/^\d{2}:\d{2}$/, "Expected HH:MM format"),
  closed: z.boolean(),
});

export const HolidaySchema = z.object({
  date: z.string(),
  name: z.string(),
});

export const VacationSchema = z.object({
  start: z.string(),
  end: z.string(),
  reason: z.string().optional(),
});

export const ShippingConfigSchema = z.object({
  localDeliveryRadiusKm: z.number().min(1).max(500),
  localDeliveryCenterLat: z.number(),
  localDeliveryCenterLng: z.number(),
  freeLocalDelivery: z.boolean(),
  freePickup: z.boolean(),
  auspostApiKey: z.string().optional(),
});

export const SettingsDocSchema = z.object({
  _id: z.literal("global"),
  businessHours: z.array(BusinessHourDaySchema).length(7),
  holidays: z.array(HolidaySchema),
  vacations: z.array(VacationSchema),
  shipping: ShippingConfigSchema,
  updatedAt: z.string(),
});

// ─── Service Config ─────────────────────────────────────────────────

export const MaterialConfigSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  fullName: z.string(),
  ratePerGram: z.number().nullable(),
  density: z.number().nullable(),
  defaultLayerHeight: z.number().optional(),
  defaultInfill: z.number().optional(),
  description: z.string(),
  colors: z.array(z.string()),
  suggested: z.boolean(),
  enabled: z.boolean(),
  compatibleServices: z.array(ServiceTypeEnum).optional(),
});
export type MaterialConfig = z.infer<typeof MaterialConfigSchema>;

export const QualityPresetSchema = z.object({
  label: z.string(),
  layerHeightMm: z.number(),
  timeMultiplier: z.number(),
  description: z.string(),
});

export const InfillPresetSchema = z.object({
  label: z.string(),
  materialMultiplier: z.number(),
  description: z.string(),
});

export const ScaleRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
  step: z.number(),
  default: z.number(),
});

export const ServiceSettingsSchema = z.object({
  hourlyRate: z.number().min(1),
  currency: z.string(),
  qualityPresets: z.record(QualityPresetSchema).optional(),
  infillPresets: z.record(InfillPresetSchema).optional(),
  scaleRange: ScaleRangeSchema.optional(),
  // Laser/milling specific
  cutPricePerMm: z.number().optional(),
  engravePricePerMm2: z.number().optional(),
  setupFee: z.number(),
});
export type ServiceSettings = z.infer<typeof ServiceSettingsSchema>;

export const ServiceConfigDocSchema = z.object({
  serviceType: ServiceTypeEnum,
  enabled: z.boolean(),
  displayName: z.string(),
  materials: z.array(MaterialConfigSchema),
  settings: ServiceSettingsSchema,
  updatedAt: z.string(),
});

// ─── Quotes ─────────────────────────────────────────────────────────

// Quote params vary by service type
// NOTE: For actual validation, use the service-specific schemas directly.
// The discriminated union below is for reference only.
export const QuoteParams3dSchema = z.object({
  material: z.string().min(1),
  quantity: z.number().int().min(1).max(1000),
  quality: z.enum(["draft", "standard", "high"]).optional(),
  infill: z.number().int().min(5).max(25).optional(),
  scalePercent: z.number().min(50).max(200).optional(),
});

export const QuoteParamsLaserMillingSchema = z.object({
  material: z.string().min(1),
  quantity: z.number().int().min(1).max(1000),
  thickness: z.number().min(0.1).optional(),
  operation: z.enum(["cut", "engrave", "both"]),
});

// Discriminated union — constructed manually to avoid TS issues
export const QuoteParamsSchema = z.object({
  serviceType: ServiceTypeEnum,
  material: z.string().min(1),
  quantity: z.number().int().min(1).max(1000),
  quality: z.enum(["draft", "standard", "high"]).optional(),
  infill: z.number().int().min(5).max(25).optional(),
  scalePercent: z.number().min(50).max(200).optional(),
  thickness: z.number().min(0.1).optional(),
  operation: z.enum(["cut", "engrave", "both"]).optional(),
});

export const QuoteAnalysisSchema = z.object({
  analysisAvailable: z.boolean(),
  fileKind: z.string(),
  boundingBoxMm: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional(),
  triangleCount: z.number().optional(),
  estimatedMaterialGrams: z.number().optional(),
  estimatedPrintHours: z.number().optional(),
  estimatedTimeMinutes: z.number().optional(),
  estimatedPriceAud: z.number().optional(),
  cutLengthMm: z.number().optional(),
  cutAreaMm2: z.number().optional(),
  previewNote: z.string(),
  confidence: z.enum(["low", "medium", "high"]),
  needsManualQuote: z.boolean().optional(),
});

export const QuoteDeliverySchema = z.object({
  method: DeliveryMethodEnum,
  address: z.string().optional(),
  suburb: z.string().optional(),
  postcode: z.string().optional(),
  isLocal: z.boolean(),
  cost: z.number().nullable(),
  estimate: z.string().nullable(),
});

export const QuotePaymentSchema = z.object({
  stripeCheckoutUrl: z.string().nullable(),
  stripeSessionId: z.string().nullable(),
  paidAt: z.string().nullable(),
});

export const QuoteDocSchema = z.object({
  quoteNumber: z.number().int().positive(),
  userId: z.string().nullable(),
  userEmail: z.string().email(),
  userName: z.string(),
  serviceType: ServiceTypeEnum,
  status: QuoteStatusEnum,
  // File info
  fileName: z.string(),
  fileStoredAs: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  // Params
  params: z.record(z.unknown()),
  // Analysis
  analysis: QuoteAnalysisSchema.nullable(),
  // Pricing
  quotedPrice: z.number().nullable(),
  // Delivery
  delivery: QuoteDeliverySchema,
  // Payment
  payment: QuotePaymentSchema,
  // Queue
  queuePosition: z.number().nullable(),
  turnaroundEstimate: z.string().nullable(),
  estimatedCompletionDate: z.string().nullable(),
  // Notes
  notes: z.string(),
  adminNotes: z.string().nullable(),
  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Quote Input (public-facing, minimal) ───────────────────────────

export const QuoteInputSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  suburb: z.string().min(1).max(200),
  serviceType: ServiceTypeEnum,
  params: z.record(z.unknown()),
  delivery: z.object({
    method: DeliveryMethodEnum,
    suburb: z.string().optional(),
    postcode: z.string().optional(),
    address: z.string().optional(),
  }),
  notes: z.string().max(5000),
});

// ─── User (synced from Clerk) ───────────────────────────────────────

export const UserDocSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["customer", "admin"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
