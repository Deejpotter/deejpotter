/**
 * print-estimate.ts — Weight, print time and price for a 3D print
 *
 * One set of maths for the live estimate in the browser and the stored
 * estimate on the server, so the number a customer sees while choosing options
 * is the number Deej sees on the quote. It has no Node or database imports for
 * that reason; callers pass in the rates and presets.
 *
 * The weight model follows how a slicer builds a part: the outer skin (walls,
 * top and bottom) prints solid, and only the inside is filled at the chosen
 * infill. Skin volume is approximated as surface area × skin thickness, capped
 * at the part's volume so thin parts come out fully solid.
 */

import type { BoundingBoxMm, StlGeometry } from "./stl-geometry";

/**
 * Typical skin thickness: 3 walls of a 0.4 mm nozzle is 1.2 mm, and 4–5 top
 * and bottom layers at 0.2–0.3 mm is about the same.
 */
const SKIN_THICKNESS_CM = 0.12;
/**
 * Average plastic deposited per hour at standard quality on Deej's printers,
 * including travel and slower perimeters. Quality presets scale the time.
 */
const GRAMS_PER_HOUR_STANDARD = 15;
/** Warm-up, first-layer checks and removing the part, charged once per job. */
const SETUP_HOURS = 0.25;
/** Fixed handling charge per job (slicing, bed prep, packing). */
const BASE_FEE_AUD = 8;
const MINIMUM_PRICE_AUD = 5;
/** PLA's density, used when a material doesn't have one set. */
const DEFAULT_DENSITY = 1.24;

export interface EstimateOptions {
  quantity: number;
  /** Infill percentage, e.g. 15. */
  infill: number;
  /** 100 = as modelled. */
  scalePercent: number;
  /** From the quality preset: 1 = standard, >1 slower (finer layers). */
  timeMultiplier: number;
  ratePerGram: number;
  hourlyRate: number;
  densityGPerCm3?: number | null;
}

export interface PrintEstimate {
  /** Plastic for one part, in grams. */
  gramsEach: number;
  /** Plastic for the whole order. */
  totalGrams: number;
  printHours: number;
  priceAud: number;
  /** Scaled outer size of one part, for packaging and the quote. */
  boundingBoxMm: BoundingBoxMm;
}

const round = (n: number, places: number) => Math.round(n * 10 ** places) / 10 ** places;

export function estimatePrint(geometry: StlGeometry, opts: EstimateOptions): PrintEstimate {
  const scale = opts.scalePercent / 100;
  const quantity = Math.max(1, Math.floor(opts.quantity));
  // Volume grows with the cube of the scale, surface area with the square.
  const volumeCm3 = (geometry.volumeMm3 / 1000) * scale ** 3;
  const areaCm2 = (geometry.surfaceAreaMm2 / 100) * scale ** 2;

  const skin = Math.min(volumeCm3, areaCm2 * SKIN_THICKNESS_CM);
  const interior = Math.max(0, volumeCm3 - skin);
  const printedCm3 = skin + interior * (opts.infill / 100);
  const gramsEach = Math.max(1, printedCm3 * (opts.densityGPerCm3 || DEFAULT_DENSITY));
  const totalGrams = gramsEach * quantity;

  const printHours = SETUP_HOURS + (totalGrams / GRAMS_PER_HOUR_STANDARD) * opts.timeMultiplier;
  const priceAud = Math.max(MINIMUM_PRICE_AUD, BASE_FEE_AUD + totalGrams * opts.ratePerGram + printHours * opts.hourlyRate);

  const b = geometry.boundingBoxMm;
  return {
    gramsEach: round(gramsEach, 1),
    totalGrams: round(totalGrams, 1),
    printHours: round(printHours, 1),
    priceAud: round(priceAud, 2),
    boundingBoxMm: { x: round(b.x * scale, 1), y: round(b.y * scale, 1), z: round(b.z * scale, 1) },
  };
}
