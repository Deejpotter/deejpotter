/**
 * 1D Cutting Stock Problem Optimizer
 *
 * Implements First Fit Decreasing (FFD) and Best Fit Decreasing (BFD) algorithms
 * for optimizing linear material cuts with minimal waste.
 *
 * References:
 * - Johnson, D.S. (1973) "Near-optimal bin packing algorithms" MIT PhD Thesis
 * - Dósa, György (2007) Tight bound proof: FFD ≤ (11/9) * OPT + 6/9
 * - Wikipedia: https://en.wikipedia.org/wiki/First-fit-decreasing_bin_packing
 *
 * @see http://bookstack.deejpotter.com/books/deejpottercom/page/20-series-cut-calculator-implementation-guide
 */

import type {
  CutRequirement,
  CalculationResult,
  CutPattern,
  CutCalculatorInput,
  AlgorithmType,
} from "@/types/cutCalculator";

/**
 * First Fit Decreasing Algorithm for 1D Cutting Stock Problem
 *
 * Strategy:
 * 1. Sort all required cuts in descending order (largest first)
 * 2. For each cut, place it in the first bin (stock piece) where it fits
 * 3. If no existing bin has space, open a new bin
 *
 * Time Complexity: O(n log n) where n = total number of cuts
 * Space Complexity: O(n)
 * Approximation Ratio: ≤ (11/9) * OPT + 6/9
 *
 * @param stockLength - Length of stock material in millimeters
 * @param requirements - Array of cut requirements
 * @returns Calculation result with patterns and statistics
 */
export function firstFitDecreasing(
  stockLength: number,
  requirements: CutRequirement[]
): CalculationResult {
  const startTime = performance.now();

  // Step 1: Expand requirements into individual cuts
  // Convert {length: 450, quantity: 3} into [450, 450, 450]
  const allCuts: number[] = [];
  requirements.forEach((req) => {
    for (let i = 0; i < req.quantity; i++) {
      allCuts.push(req.length);
    }
  });

  // Step 2: Sort cuts in descending order (largest first)
  // This is the "Decreasing" part of First Fit Decreasing
  // Larger items are placed first for better bin utilization
  allCuts.sort((a, b) => b - a);

  // Step 3: Initialize data structures for bins (stock pieces)
  const bins: number[][] = []; // Each bin contains array of cut lengths
  const binRemainingSpace: number[] = []; // Track remaining space in each bin

  // Step 4: Place each cut using First Fit strategy
  for (const cut of allCuts) {
    let placed = false;

    // Try to fit in existing bins (first fit - use first available)
    for (let i = 0; i < bins.length; i++) {
      if (binRemainingSpace[i] >= cut) {
        // Cut fits in this bin
        bins[i].push(cut);
        binRemainingSpace[i] -= cut;
        placed = true;
        break; // First fit - stop at first available
      }
    }

    // If no existing bin can accommodate this cut, open a new bin
    if (!placed) {
      bins.push([cut]);
      binRemainingSpace.push(stockLength - cut);
    }
  }

  // Step 5: Calculate statistics and format results
  const patterns: CutPattern[] = bins.map((cuts, index) => {
    const waste = binRemainingSpace[index];
    const usedLength = stockLength - waste;
    const utilization = (usedLength / stockLength) * 100;

    return {
      stockIndex: index + 1, // 1-indexed for user display
      cuts,
      waste,
      utilization: Math.round(utilization * 10) / 10, // Round to 1 decimal
    };
  });

  const totalWaste = binRemainingSpace.reduce((sum, waste) => sum + waste, 0);
  const averageUtilization =
    patterns.reduce((sum, p) => sum + p.utilization, 0) / patterns.length;

  const executionTime = performance.now() - startTime;

  return {
    patterns,
    totalStock: bins.length,
    totalWaste,
    averageUtilization: Math.round(averageUtilization * 10) / 10,
    executionTime: Math.round(executionTime * 100) / 100,
  };
}

/**
 * Best Fit Decreasing Algorithm for 1D Cutting Stock Problem
 *
 * Strategy:
 * 1. Sort all required cuts in descending order (largest first)
 * 2. For each cut, place it in the bin with the LEAST remaining space that still fits
 * 3. If no existing bin has space, open a new bin
 *
 * Difference from FFD: Instead of first available bin, choose best fitting bin
 * This can result in tighter packing but is slower to compute
 *
 * Time Complexity: O(n² log n) where n = total number of cuts
 * Space Complexity: O(n)
 * Approximation Ratio: ≤ (11/9) * OPT + 6/9 (same as FFD)
 *
 * @param stockLength - Length of stock material in millimeters
 * @param requirements - Array of cut requirements
 * @returns Calculation result with patterns and statistics
 */
export function bestFitDecreasing(
  stockLength: number,
  requirements: CutRequirement[]
): CalculationResult {
  const startTime = performance.now();

  // Step 1 & 2: Expand and sort (same as FFD)
  const allCuts: number[] = [];
  requirements.forEach((req) => {
    for (let i = 0; i < req.quantity; i++) {
      allCuts.push(req.length);
    }
  });

  allCuts.sort((a, b) => b - a);

  // Step 3: Initialize bins
  const bins: number[][] = [];
  const binRemainingSpace: number[] = [];

  // Step 4: Place each cut using Best Fit strategy
  for (const cut of allCuts) {
    let bestBinIndex = -1;
    let smallestRemainder = Infinity;

    // Find bin with smallest remainder that still fits the cut
    // This is the "Best Fit" strategy - pack as tightly as possible
    for (let i = 0; i < bins.length; i++) {
      if (
        binRemainingSpace[i] >= cut &&
        binRemainingSpace[i] < smallestRemainder
      ) {
        bestBinIndex = i;
        smallestRemainder = binRemainingSpace[i];
      }
    }

    if (bestBinIndex !== -1) {
      // Found a bin - place cut there
      bins[bestBinIndex].push(cut);
      binRemainingSpace[bestBinIndex] -= cut;
    } else {
      // No bin fits - open new bin
      bins.push([cut]);
      binRemainingSpace.push(stockLength - cut);
    }
  }

  // Step 5: Calculate statistics (same as FFD)
  const patterns: CutPattern[] = bins.map((cuts, index) => {
    const waste = binRemainingSpace[index];
    const usedLength = stockLength - waste;
    const utilization = (usedLength / stockLength) * 100;

    return {
      stockIndex: index + 1,
      cuts,
      waste,
      utilization: Math.round(utilization * 10) / 10,
    };
  });

  const totalWaste = binRemainingSpace.reduce((sum, waste) => sum + waste, 0);
  const averageUtilization =
    patterns.reduce((sum, p) => sum + p.utilization, 0) / patterns.length;

  const executionTime = performance.now() - startTime;

  return {
    patterns,
    totalStock: bins.length,
    totalWaste,
    averageUtilization: Math.round(averageUtilization * 10) / 10,
    executionTime: Math.round(executionTime * 100) / 100,
  };
}

/**
 * Main calculation function with algorithm selection and validation
 *
 * Validates inputs and delegates to appropriate algorithm implementation.
 *
 * @param input - Complete calculation input with algorithm selection
 * @returns Calculation result with patterns and statistics
 * @throws Error if validation fails
 */
export function calculateOptimalCuts(
  input: CutCalculatorInput
): CalculationResult {
  // Validation: Stock length
  if (input.stockLength <= 0) {
    throw new Error("Stock length must be greater than 0");
  }

  // Validation: At least one requirement
  if (input.requirements.length === 0) {
    throw new Error("At least one cut requirement is needed");
  }

  // Validation: All cuts must be positive
  const invalidLengths = input.requirements.filter((req) => req.length <= 0);

  if (invalidLengths.length > 0) {
    throw new Error(
      `All cut lengths must be greater than 0. Invalid: ${invalidLengths
        .map((c) => c.length)
        .join(", ")}`
    );
  }

  // Validation: All quantities must be positive integers
  const invalidQuantities = input.requirements.filter(
    (req) => req.quantity <= 0 || !Number.isInteger(req.quantity)
  );

  if (invalidQuantities.length > 0) {
    throw new Error(
      `All quantities must be positive integers. Invalid: ${invalidQuantities
        .map((c) => c.quantity)
        .join(", ")}`
    );
  }

  // Validation: No cut can be longer than stock
  const tooLongCuts = input.requirements.filter(
    (req) => req.length > input.stockLength
  );

  if (tooLongCuts.length > 0) {
    throw new Error(
      `Some cuts are longer than stock length (${
        input.stockLength
      }mm): ${tooLongCuts.map((c) => c.length).join(", ")}mm`
    );
  }

  // Execute selected algorithm
  switch (input.algorithm) {
    case "FFD":
      return firstFitDecreasing(input.stockLength, input.requirements);
    case "BFD":
      return bestFitDecreasing(input.stockLength, input.requirements);
    default:
      // TypeScript should catch this, but failsafe for runtime
      throw new Error(`Unknown algorithm: ${input.algorithm}`);
  }
}

/**
 * Utility function to calculate waste percentage
 *
 * @param waste - Waste length in millimeters
 * @param stockLength - Stock length in millimeters
 * @returns Waste percentage (0-100)
 */
export function calculateWastePercentage(
  waste: number,
  stockLength: number
): number {
  return Math.round((waste / stockLength) * 1000) / 10; // Round to 1 decimal
}

/**
 * Utility function to format cut length for display
 *
 * @param length - Length in millimeters
 * @returns Formatted string (e.g., "450mm")
 */
export function formatCutLength(length: number): string {
  return `${length}mm`;
}

/**
 * Utility function to generate cut pattern description
 *
 * @param pattern - Cut pattern to describe
 * @returns Human-readable description
 */
export function describeCutPattern(pattern: CutPattern): string {
  const cutsList = pattern.cuts.map(formatCutLength).join(" + ");
  const wasteStr = formatCutLength(pattern.waste);
  return `Stock #${pattern.stockIndex}: ${cutsList} | Waste: ${wasteStr} (${
    100 - pattern.utilization
  }%)`;
}
