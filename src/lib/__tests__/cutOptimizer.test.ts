/**
 * Unit tests for 1D Cutting Stock Problem Optimizer
 *
 * Tests cover:
 * - Best Fit Decreasing (BFD) algorithm
 * - Input validation
 * - Edge cases
 * - Performance characteristics
 *
 * @see http://bookstack.deejpotter.com/books/deejpottercom/page/20-series-cut-calculator-implementation-guide
 */

import { describe, it, expect } from "vitest";
import {
  bestFitDecreasing,
  calculateOptimalCuts,
  calculateWastePercentage,
  formatCutLength,
  describeCutPattern,
} from "../cutOptimizer";
import type { CutRequirement, StockItem } from "@/types/cutCalculator";

describe("Cut Optimizer - Best Fit Decreasing", () => {
  describe("bestFitDecreasing", () => {
    it("should handle multiple stock items and requirements", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 450, quantity: 3 },
        { id: "2", length: 250, quantity: 2 },
        { id: "3", length: 150, quantity: 4 },
      ];

      const stockItems: StockItem[] = [
        { id: "s1", length: 1000, quantity: 10 },
      ];

      const bfdResult = bestFitDecreasing(stockItems, requirements, 0);

      // Verify all cuts are present
      const bfdTotalCuts = bfdResult.patterns.flatMap((p) => p.cuts);
      expect(bfdTotalCuts).toHaveLength(9); // 3+2+4
      expect(bfdResult.totalStock).toBeGreaterThan(0);
    });

    it("should handle perfect fit", () => {
      const requirements: CutRequirement[] = [
        { id: "1", length: 500, quantity: 2 },
      ];

      const stockItems: StockItem[] = [
        { id: "s1", length: 1000, quantity: 10 },
      ];

      const result = bestFitDecreasing(stockItems, requirements, 0);

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

      const stockItems: StockItem[] = [
        { id: "s1", length: 1000, quantity: 10 },
      ];

      const result = bestFitDecreasing(stockItems, requirements, 0);

      // Should fit in 2 bins: [600, 400] and [300]
      expect(result.totalStock).toBe(2);
    });
  });
});

describe("Cut Optimizer - Main Function", () => {
  describe("calculateOptimalCuts", () => {
    it("should throw error for empty stock items", () => {
      expect(() => {
        calculateOptimalCuts({
          stockItems: [],
          requirements: [{ id: "1", length: 100, quantity: 1 }],
          kerfWidth: 0,
        });
      }).toThrow("At least one stock item is required");
    });

    it("should throw error for zero stock length", () => {
      expect(() => {
        calculateOptimalCuts({
          stockItems: [{ id: "s1", length: 0, quantity: 1 }],
          requirements: [{ id: "1", length: 100, quantity: 1 }],
          kerfWidth: 0,
        });
      }).toThrow("All stock lengths must be greater than 0");
    });

    it("should throw error for negative stock length", () => {
      expect(() => {
        calculateOptimalCuts({
          stockItems: [{ id: "s1", length: -500, quantity: 1 }],
          requirements: [{ id: "1", length: 100, quantity: 1 }],
          kerfWidth: 0,
        });
      }).toThrow("All stock lengths must be greater than 0");
    });

    it("should throw error for empty requirements", () => {
      expect(() => {
        calculateOptimalCuts({
          stockItems: [{ id: "s1", length: 1000, quantity: 1 }],
          requirements: [],
          kerfWidth: 0,
        });
      }).toThrow("At least one cut requirement is needed");
    });

    it("should throw error for cut longer than stock", () => {
      expect(() => {
        calculateOptimalCuts({
          stockItems: [{ id: "s1", length: 500, quantity: 1 }],
          requirements: [{ id: "1", length: 600, quantity: 1 }],
          kerfWidth: 0,
        });
      }).toThrow("Some cuts are longer than longest available stock");
    });

    it("should throw error for zero length cut", () => {
      expect(() => {
        calculateOptimalCuts({
          stockItems: [{ id: "s1", length: 1000, quantity: 1 }],
          requirements: [{ id: "1", length: 0, quantity: 1 }],
          kerfWidth: 0,
        });
      }).toThrow("All cut lengths must be greater than 0");
    });

    it("should throw error for negative length cut", () => {
      expect(() => {
        calculateOptimalCuts({
          stockItems: [{ id: "s1", length: 1000, quantity: 1 }],
          requirements: [{ id: "1", length: -100, quantity: 1 }],
          kerfWidth: 0,
        });
      }).toThrow("All cut lengths must be greater than 0");
    });

    it("should throw error for zero quantity", () => {
      expect(() => {
        calculateOptimalCuts({
          stockItems: [{ id: "s1", length: 1000, quantity: 1 }],
          requirements: [{ id: "1", length: 100, quantity: 0 }],
          kerfWidth: 0,
        });
      }).toThrow("All quantities must be positive integers");
    });

    it("should throw error for fractional quantity", () => {
      expect(() => {
        calculateOptimalCuts({
          stockItems: [{ id: "s1", length: 1000, quantity: 1 }],
          requirements: [{ id: "1", length: 100, quantity: 1.5 }],
          kerfWidth: 0,
        });
      }).toThrow("All quantities must be positive integers");
    });

    it("should execute BFD algorithm", () => {
      const result = calculateOptimalCuts({
        stockItems: [{ id: "s1", length: 1000, quantity: 10 }],
        requirements: [{ id: "1", length: 500, quantity: 2 }],
        kerfWidth: 0,
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

    const stockItems: StockItem[] = [
      { id: "s1", length: 1000, quantity: 10 },
    ];

    const result = calculateOptimalCuts({
      stockItems,
      requirements,
      kerfWidth: 0,
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

    const stockItems: StockItem[] = [
      { id: "s1", length: 1000, quantity: 20 },
    ];

    const result = calculateOptimalCuts({
      stockItems,
      requirements,
      kerfWidth: 0,
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

    const stockItems: StockItem[] = [
      { id: "s1", length: 1000, quantity: 10 },
    ];

    const result = calculateOptimalCuts({
      stockItems,
      requirements,
      kerfWidth: 0,
    });

    expect(result.totalStock).toBe(3); // 5 cuts per stock = 3 stocks for 15 cuts
    expect(result.totalWaste).toBe(0); // Perfect fit
  });

  it("should handle edge case: single large cut per stock", () => {
    const requirements: CutRequirement[] = [
      { id: "1", length: 950, quantity: 5 },
    ];

    const stockItems: StockItem[] = [
      { id: "s1", length: 1000, quantity: 10 },
    ];

    const result = calculateOptimalCuts({
      stockItems,
      requirements,
      kerfWidth: 0,
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

    const stockItems: StockItem[] = [
      { id: "s1", length: 1000, quantity: 100 },
    ];

    const startTime = performance.now();
    const result = calculateOptimalCuts({
      stockItems,
      requirements,
      kerfWidth: 0,
    });
    const endTime = performance.now();

    // Should complete in reasonable time (< 500ms for 300 cuts)
    expect(endTime - startTime).toBeLessThan(500);

    // Verify all cuts are present
    const totalCuts = result.patterns.flatMap((p) => p.cuts);
    expect(totalCuts).toHaveLength(300);
  });

  it("should execute efficiently with BFD algorithm", () => {
    const requirements: CutRequirement[] = [
      { id: "1", length: 450, quantity: 20 },
      { id: "2", length: 250, quantity: 20 },
      { id: "3", length: 150, quantity: 20 },
    ];

    const stockItems: StockItem[] = [
      { id: "s1", length: 1000, quantity: 20 },
    ];

    const result = calculateOptimalCuts({
      stockItems,
      requirements,
      kerfWidth: 0,
    });

    // BFD should complete and produce valid results
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
    expect(result.totalStock).toBeGreaterThan(0);
  });
});
