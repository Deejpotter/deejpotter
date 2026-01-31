import React from "react";
import { render, screen } from "@testing-library/react";
import ResultsDisplay from "../app/projects/tools/20-series-cut-calculator/ResultsDisplay";

const sampleResult = {
  totalStock: 12,
  averageUtilization: 82.3,
  totalWaste: 350,
  executionTime: 12.34,
  totalCost: 123.45,
  totalSetupFees: 36,
  totalCuttingCosts: 78,
  costByLength: [],
  patterns: [],
};

test("renders ResultsDisplay with summary", () => {
  render(<ResultsDisplay result={sampleResult as any} />);
  expect(screen.getByText(/Results Summary/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Cost/i)).toBeInTheDocument();
});
