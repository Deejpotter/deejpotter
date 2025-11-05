/**
 * Type definitions for 20 Series Cut Calculator
 *
 * Implements 1D cutting stock problem optimization using
 * First Fit Decreasing (FFD) and Best Fit Decreasing (BFD) algorithms.
 *
 * @see http://bookstack.deejpotter.com/books/deejpottercom/page/20-series-cut-calculator-implementation-guide
 */

/**
 * Represents a single cut requirement from the user
 */
export type CutRequirement = {
  /** Unique identifier for the requirement */
  id: string;
  /** Length of the cut in millimeters */
  length: number;
  /** Number of pieces needed at this length */
  quantity: number;
};

/**
 * Represents a cutting pattern for a single stock piece
 */
export type CutPattern = {
  /** Stock piece number (1-indexed) */
  stockIndex: number;
  /** Array of cut lengths placed in this stock piece */
  cuts: number[];
  /** Waste/leftover length in millimeters */
  waste: number;
  /** Utilization percentage (0-100) */
  utilization: number;
};

/**
 * Complete calculation result with patterns and statistics
 */
export type CalculationResult = {
  /** Array of cutting patterns, one per stock piece */
  patterns: CutPattern[];
  /** Total number of stock pieces needed */
  totalStock: number;
  /** Total waste across all stock pieces in millimeters */
  totalWaste: number;
  /** Average utilization across all stock pieces (0-100) */
  averageUtilization: number;
  /** Algorithm execution time in milliseconds */
  executionTime: number;
};

/**
 * Available optimization algorithms
 *
 * - FFD: First Fit Decreasing - Fast, O(n log n), approximation ≤ 11/9 OPT + 6/9
 * - BFD: Best Fit Decreasing - Slower, O(n² log n), potentially better packing
 */
export type AlgorithmType = "FFD" | "BFD";

/**
 * Input parameters for cut calculation
 */
export type CutCalculatorInput = {
  /** Stock length in millimeters (e.g., 1000mm for standard 20-series) */
  stockLength: number;
  /** Array of cut requirements */
  requirements: CutRequirement[];
  /** Selected optimization algorithm */
  algorithm: AlgorithmType;
};

/**
 * Validation error types
 */
export type ValidationError = {
  /** Field that failed validation */
  field: string;
  /** Error message */
  message: string;
};
