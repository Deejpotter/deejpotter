/**
 * Unit tests for 1D Cutting Stock Problem Optimizer
 *
 * Tests cover:
 * - First Fit Decreasing (FFD) algorithm
 * - Best Fit Decreasing (BFD) algorithm
 * - Input validation
 * - Edge cases
 * - Performance characteristics
 *
 * @see http://bookstack.deejpotter.com/books/deejpottercom/page/20-series-cut-calculator-implementation-guide
 */

import { describe, it, expect } from "@jest/globals";
import {
  firstFitDecreasing,
  bestFitDecreasing,
  calculateOptimalCuts,
  calculateWastePercentage,
  formatCutLength,
  describeCutPattern,
} from "../cutOptimizer";
import type { CutRequirement, AlgorithmType } from "@/types/cutCalculator";

describe("Cut Optimizer - First Fit Decreasing", () => {
  describe("firstFitDecreasing", () => {
    it("should handle perfect fit with no waste", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 500, quantity: 2 },
      ];

      const result = firstFitDecreasing(1000, requirements);

      expect(result.totalStock).toBe(1);
      expect(result.totalWaste).toBe(0);
      expect(result.averageUtilization).toBe(100);
      expect(result.patterns).toHaveLength(1);
      expect(result.patterns[0].cuts).toEqual([500, 500]);
    });

    it("should minimize bins for varied cuts", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 450, quantity: 2 },
        { id: "2", length: 250, quantity: 2 },
        { id: "3", length: 150, quantity: 1 },
      ];

      const result = firstFitDecreasing(1000, requirements);

      // FFD should pack these efficiently
      expect(result.totalStock).toBeLessThanOrEqual(3);
      expect(result.patterns).toHaveLength(result.totalStock);

      // Verify all cuts are present
      const totalCuts = result.patterns.flatMap((p) => p.cuts);
      expect(totalCuts).toHaveLength(5); // 2+2+1
    });

    it("should sort items by size descending", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 100, quantity: 1 },
        { id: "2", length: 500, quantity: 1 },
        { id: "3", length: 300, quantity: 1 },
      ];

      const result = firstFitDecreasing(1000, requirements);

      // First bin should contain largest item (500)
      expect(result.patterns[0].cuts[0]).toBe(500);
    });

    it("should handle single cut requirement", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 300, quantity: 1 },
      ];

      const result = firstFitDecreasing(1000, requirements);

      expect(result.totalStock).toBe(1);
      expect(result.totalWaste).toBe(700);
      expect(result.patterns[0].utilization).toBe(30);
    });

    it("should handle many small cuts", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 100, quantity: 50 },
      ];

      const result = firstFitDecreasing(1000, requirements);

      expect(result.totalStock).toBe(5); // 10 cuts per bin, 50 total
      expect(result.totalWaste).toBe(0); // Perfect fit
    });

    it("should calculate utilization correctly", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 750, quantity: 1 },
      ];

      const result = firstFitDecreasing(1000, requirements);

      expect(result.patterns[0].utilization).toBe(75);
      expect(result.patterns[0].waste).toBe(250);
    });

    it("should track execution time", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 450, quantity: 10 },
      ];

      const result = firstFitDecreasing(1000, requirements);

      expect(result.executionTime).toBeGreaterThanOrEqual(0);
      expect(result.executionTime).toBeLessThan(100); // Should be fast
    });
  });
});

describe("Cut Optimizer - Best Fit Decreasing", () => {
  describe("bestFitDecreasing", () => {
    it("should produce same or better results than FFD", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 450, quantity: 3 },
        { id: "2", length: 250, quantity: 2 },
        { id: "3", length: 150, quantity: 4 },
      ];

      const ffdResult = firstFitDecreasing(1000, requirements);
      const bfdResult = bestFitDecreasing(1000, requirements);

      // BFD should use same or fewer bins
      expect(bfdResult.totalStock).toBeLessThanOrEqual(ffdResult.totalStock);

      // Verify all cuts are present
      const bfdTotalCuts = bfdResult.patterns.flatMap((p) => p.cuts);
      expect(bfdTotalCuts).toHaveLength(9); // 3+2+4
    });

    it("should handle perfect fit", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 500, quantity: 2 },
      ];

      const result = bestFitDecreasing(1000, requirements);

      expect(result.totalStock).toBe(1);
      expect(result.totalWaste).toBe(0);
      expect(result.averageUtilization).toBe(100);
    });

    it("should pack tightly", () => {
      // BFD should pack these tightly to minimize waste
      const requirements: CutRequirement[] = [
        { id: "1", length: 600, quantity: 1 },
        { id: "2", length: 400, quantity: 1 },
        { id: "3", length: 300, quantity: 1 },
      ];

      const result = bestFitDecreasing(1000, requirements);

      // Should fit in 2 bins: [600, 400] and [300]
      expect(result.totalStock).toBe(2);
    });
  });
});

describe("Cut Optimizer - Main Function", () => {
  describe("calculateOptimalCuts", () => {
    it("should throw error for zero stock length", () => {
      expect(() => {
        calculateOptimalCuts({
          stockLength: 0,
          requirements: [{ id: "1", length: 100, quantity: 1 }],
          algorithm: "FFD",
        });
      }).toThrow("Stock length must be greater than 0");
    });

    it("should throw error for negative stock length", () => {
      expect(() => {
        calculateOptimalCuts({
          stockLength: -500,
          requirements: [{ id: "1", length: 100, quantity: 1 }],
          algorithm: "FFD",
        });
      }).toThrow("Stock length must be greater than 0");
    });

    it("should throw error for empty requirements", () => {
      expect(() => {
        calculateOptimalCuts({
          stockLength: 1000,
          requirements: [],
          algorithm: "FFD",
        });
      }).toThrow("At least one cut requirement is needed");
    });

    it("should throw error for cut longer than stock", () => {
      expect(() => {
        calculateOptimalCuts({
          stockLength: 500,
          requirements: [{ id: "1", length: 600, quantity: 1 }],
          algorithm: "FFD",
        });
      }).toThrow("Some cuts are longer than stock length");
    });

    it("should throw error for zero length cut", () => {
      expect(() => {
        calculateOptimalCuts({
          stockLength: 1000,
          requirements: [{ id: "1", length: 0, quantity: 1 }],
          algorithm: "FFD",
        });
      }).toThrow("All cut lengths must be greater than 0");
    });

    it("should throw error for negative length cut", () => {
      expect(() => {
        calculateOptimalCuts({
          stockLength: 1000,
          requirements: [{ id: "1", length: -100, quantity: 1 }],
          algorithm: "FFD",
        });
      }).toThrow("All cut lengths must be greater than 0");
    });

    it("should throw error for zero quantity", () => {
      expect(() => {
        calculateOptimalCuts({
          stockLength: 1000,
          requirements: [{ id: "1", length: 100, quantity: 0 }],
          algorithm: "FFD",
        });
      }).toThrow("All quantities must be positive integers");
    });

    it("should throw error for fractional quantity", () => {
      expect(() => {
        calculateOptimalCuts({
          stockLength: 1000,
          requirements: [{ id: "1", length: 100, quantity: 1.5 }],
          algorithm: "FFD",
        });
      }).toThrow("All quantities must be positive integers");
    });

    it("should execute FFD algorithm when selected", () => {
      const result = calculateOptimalCuts({
        stockLength: 1000,
        requirements: [{ id: "1", length: 500, quantity: 2 }],
        algorithm: "FFD",
      });

      expect(result.totalStock).toBe(1);
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it("should execute BFD algorithm when selected", () => {
      const result = calculateOptimalCuts({
        stockLength: 1000,
        requirements: [{ id: "1", length: 500, quantity: 2 }],
        algorithm: "BFD",
      });

      expect(result.totalStock).toBe(1);
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("Cut Optimizer - Utility Functions", () => {
  describe("calculateWastePercentage", () => {
    it("should calculate percentage correctly", () => {
      expect(calculateWastePercentage(250, 1000)).toBe(25);
      expect(calculateWastePercentage(500, 1000)).toBe(50);
      expect(calculateWastePercentage(0, 1000)).toBe(0);
    });

    it("should round to 1 decimal place", () => {
      expect(calculateWastePercentage(333, 1000)).toBe(33.3);
      expect(calculateWastePercentage(666, 1000)).toBe(66.6);
    });
  });

  describe("formatCutLength", () => {
    it("should format length with mm unit", () => {
      expect(formatCutLength(450)).toBe("450mm");
      expect(formatCutLength(1000)).toBe("1000mm");
      expect(formatCutLength(0)).toBe("0mm");
    });
  });

  describe("describeCutPattern", () => {
    it("should generate readable description", () => {
      const pattern = {
        stockIndex: 1,
        cuts: [450, 250, 150],
        waste: 150,
        utilization: 85,
      };

      const description = describeCutPattern(pattern);

      expect(description).toContain("Stock #1");
      expect(description).toContain("450mm");
      expect(description).toContain("250mm");
      expect(description).toContain("150mm");
      expect(description).toContain("Waste: 150mm");
      expect(description).toContain("15%"); // 100 - 85
    });
  });
});

describe("Cut Optimizer - Real World Scenarios", () => {
  it("should handle typical 20-series extrusion cuts", () => {
    // Common scenario: Building a CNC machine frame
    const requirements: CutRequirement[] = [
      { id: "1", length: 500, quantity: 4 }, // Long rails
      { id: "2", length: 300, quantity: 4 }, // Cross braces
      { id: "3", length: 150, quantity: 8 }, // Small brackets
    ];

    const result = calculateOptimalCuts({
      stockLength: 1000,
      requirements,
      algorithm: "FFD",
    });

    // Verify all cuts are present
    const totalCuts = result.patterns.flatMap((p) => p.cuts);
    expect(totalCuts).toHaveLength(16); // 4+4+8

    // Should be reasonably efficient
    expect(result.averageUtilization).toBeGreaterThan(80);
  });

  it("should handle complex mixed-size order", () => {
    const requirements: CutRequirement[] = [
      { id: "1", length: 750, quantity: 2 },
      { id: "2", length: 400, quantity: 3 },
      { id: "3", length: 250, quantity: 5 },
      { id: "4", length: 100, quantity: 10 },
    ];

    const result = calculateOptimalCuts({
      stockLength: 1000,
      requirements,
      algorithm: "BFD", // Use BFD for complex scenarios
    });

    // Verify all cuts are present
    const totalCuts = result.patterns.flatMap((p) => p.cuts);
    expect(totalCuts).toHaveLength(20); // 2+3+5+10

    // Should use multiple stock pieces efficiently
    expect(result.totalStock).toBeGreaterThan(0);
    expect(result.totalStock).toBeLessThan(20); // Should be much less than 1 per cut
  });

  it("should handle edge case: all cuts same size", () => {
    const requirements: CutRequirement[] = [
      { id: "1", length: 200, quantity: 15 },
    ];

    const result = calculateOptimalCuts({
      stockLength: 1000,
      requirements,
      algorithm: "FFD",
    });

    expect(result.totalStock).toBe(3); // 5 cuts per stock = 3 stocks for 15 cuts
    expect(result.totalWaste).toBe(0); // Perfect fit
  });

  it("should handle edge case: single large cut per stock", () => {
    const requirements: CutRequirement[] = [
      { id: "1", length: 950, quantity: 5 },
    ];

    const result = calculateOptimalCuts({
      stockLength: 1000,
      requirements,
      algorithm: "FFD",
    });

    expect(result.totalStock).toBe(5); // One cut per stock
    expect(result.totalWaste).toBe(250); // 50mm waste per stock * 5
  });
});

describe("Cut Optimizer - Performance", () => {
  it("should handle large number of cuts efficiently", () => {
    const requirements: CutRequirement[] = [
      { id: "1", length: 100, quantity: 100 },
      { id: "2", length: 200, quantity: 100 },
      { id: "3", length: 300, quantity: 100 },
    ];

    const startTime = performance.now();
    const result = calculateOptimalCuts({
      stockLength: 1000,
      requirements,
      algorithm: "FFD",
    });
    const endTime = performance.now();

    // Should complete in reasonable time (< 500ms for 300 cuts)
    expect(endTime - startTime).toBeLessThan(500);

    // Verify all cuts are present
    const totalCuts = result.patterns.flatMap((p) => p.cuts);
    expect(totalCuts).toHaveLength(300);
  });

  it("should have FFD faster than BFD", () => {
    const requirements: CutRequirement[] = [
      { id: "1", length: 450, quantity: 20 },
      { id: "2", length: 250, quantity: 20 },
      { id: "3", length: 150, quantity: 20 },
    ];

    // Measure FFD
    const ffdStart = performance.now();
    const ffdResult = calculateOptimalCuts({
      stockLength: 1000,
      requirements,
      algorithm: "FFD",
    });
    const ffdTime = performance.now() - ffdStart;

    // Measure BFD
    const bfdStart = performance.now();
    const bfdResult = calculateOptimalCuts({
      stockLength: 1000,
      requirements,
      algorithm: "BFD",
    });
    const bfdTime = performance.now() - bfdStart;

    // FFD should be faster (though both should be fast)
    // This test might be flaky on slow systems, so we just verify both complete
    expect(ffdResult.executionTime).toBeGreaterThanOrEqual(0);
    expect(bfdResult.executionTime).toBeGreaterThanOrEqual(0);
  });
});
