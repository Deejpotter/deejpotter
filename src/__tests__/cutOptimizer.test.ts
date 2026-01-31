import {
  calculateOptimalCuts,
  calculateWastePercentage,
  formatCutLength,
  describeCutPattern,
} from "@/lib/cutOptimizer";

import type {
  CutCalculatorInput,
} from "@/types/cutCalculator";

describe("cutOptimizer utilities and main flow", () => {
  test("formatCutLength returns mm string", () => {
    expect(formatCutLength(450)).toBe("450mm");
  });

  test("calculateWastePercentage rounds to 1 decimal", () => {
    expect(calculateWastePercentage(50, 500)).toBe(10.0);
    expect(calculateWastePercentage(1, 333)).toBe(0.3);
  });

  test("describeCutPattern produces a readable description", () => {
    const pattern = {
      stockIndex: 1,
      stockLength: 1000,
      cuts: [450, 450],
      waste: 100,
      utilization: 85,
    } as any;

    const desc = describeCutPattern(pattern);
    expect(desc).toContain("Stock #1 (1000mm)");
    expect(desc).toContain("450mm + 450mm");
    expect(desc).toContain("Waste: 100mm");
  });

  test("calculateOptimalCuts validates inputs and throws on invalid cases", () => {
    const base: CutCalculatorInput = {
      stockItems: [{ id: "1", length: 1000, quantity: 1 }],
      requirements: [{ id: "1", length: 200, quantity: 1 }],
      kerfWidth: 0,
    };

    expect(() => calculateOptimalCuts({ ...base, stockItems: [] })).toThrow(
      /At least one stock item is required/
    );

    expect(() =>
      calculateOptimalCuts({
        ...base,
        requirements: [],
      })
    ).toThrow(/At least one cut requirement is needed/);

    expect(() =>
      calculateOptimalCuts({
        ...base,
        stockItems: [{ id: "1", length: -100, quantity: 1 }],
      })
    ).toThrow(/All stock lengths must be greater than 0/);

    expect(() =>
      calculateOptimalCuts({
        ...base,
        requirements: [{ id: "1", length: 2000, quantity: 1 }],
      })
    ).toThrow(/Some cuts are longer than longest available stock/);

    expect(() =>
      calculateOptimalCuts({
        ...base,
        kerfWidth: -1,
      })
    ).toThrow(/Kerf width must be non-negative/);
  });

  test("calculateOptimalCuts does a basic packing correctly", () => {
    const input: CutCalculatorInput = {
      stockItems: [
        { id: "1", length: 1000, quantity: 2 },
      ],
      requirements: [
        { id: "a", length: 450, quantity: 2 },
        { id: "b", length: 300, quantity: 1 },
      ],
      kerfWidth: 4,
    };

    const result = calculateOptimalCuts(input);
    // Expect non-empty patterns and reasonable totals
    expect(result.patterns.length).toBeGreaterThan(0);
    expect(result.totalStock).toBeGreaterThan(0);
    expect(result.totalCost).toBeGreaterThanOrEqual(0);

    // Each pattern should sum cuts correctly (ignoring kerf for simple assert)
    result.patterns.forEach((p) => {
      const sumCuts = p.cuts.reduce((s, c) => s + c, 0);
      expect(sumCuts + p.waste).toBeLessThanOrEqual(p.stockLength);
    });
  });
});
