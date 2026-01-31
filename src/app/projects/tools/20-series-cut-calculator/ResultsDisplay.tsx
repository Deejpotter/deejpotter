"use client";

import { ReactElement } from "react";
// ResultsDisplay (Tailwind-first)
// Purpose: Render summary, cost breakdown, and cutting patterns for the cut calculator.
// Rationale: Implemented with Tailwind utility classes to avoid framework coupling and to make visual parity checks straightforward.
// Testing: Covered by Vitest unit tests for behavior/accessibility and by Playwright visual snapshots for visual regression checks.

/* Results Summary: compact, focused metrics for quick review. Kept semantically simple to aid accessibility and deterministic visual tests. */



import { CalculationResult } from "@/types/cutCalculator";
import CutPatternVisualization from "./CutPatternVisualization";

type ResultsDisplayProps = {
  result: CalculationResult;
};

export default function ResultsDisplay({
  result,
}: ResultsDisplayProps): ReactElement {
  const formatNumber = (num: number, decimals = 1): string => {
    return num.toFixed(decimals);
  };

  // Calculate total stock length used
  const totalStockLength = result.patterns.reduce(
    (sum, p) => sum + p.stockLength,
    0
  );

  return (
    <div>
      <section className="rounded shadow-sm bg-white dark:bg-gray-800 p-0 mb-4">
        <div className="bg-indigo-600 text-white px-4 py-3 rounded-t">
          <h5 className="m-0 text-sm font-medium">Results Summary</h5>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center border rounded p-3">
            <h6 className="text-xs text-gray-500">Stock Pieces</h6>
            <div className="text-2xl font-semibold text-indigo-600">
              {result.totalStock}
            </div>
          </div>
          <div className="text-center border rounded p-3">
            <h6 className="text-xs text-gray-500">Utilization</h6>
            <div className="text-2xl font-semibold text-emerald-600">
              {formatNumber(result.averageUtilization)}%
            </div>
          </div>
          <div className="text-center border rounded p-3">
            <h6 className="text-xs text-gray-500">Total Waste</h6>
            <div className="text-2xl font-semibold text-yellow-500">
              {result.totalWaste.toLocaleString()}mm
            </div>
          </div>
          <div className="text-center border rounded p-3">
            <h6 className="text-xs text-gray-500">Calculation Time</h6>
            <div className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              {formatNumber(result.executionTime, 2)}ms
            </div>
          </div>
        </div>
      </section>

      /* Cost Breakdown: shows the fee and per-length cost breakdown in a compact table. Using simple tables keeps visual snapshots deterministic and makes numeric assertions easy in tests. */
      <section className="rounded shadow-sm bg-white dark:bg-gray-800 p-0 mb-4">
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-t">
          <h5 className="m-0 text-sm font-medium">Cost Breakdown</h5>
        </div>
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="text-2xl font-semibold text-emerald-600">
              ${result.totalCost.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">Total Cost</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border rounded p-3 text-center">
              <div className="text-xl font-semibold text-indigo-600">
                ${result.totalSetupFees.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">Setup Fees</div>
              <div className="text-xs text-gray-500">
                ({result.costByLength.length} unique length
                {result.costByLength.length !== 1 ? "s" : ""} × $3)
              </div>
            </div>
            <div className="border rounded p-3 text-center">
              <div className="text-xl font-semibold text-indigo-600">
                ${result.totalCuttingCosts.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">Cutting Costs</div>
              <div className="text-xs text-gray-500">
                ({result.costByLength.reduce((sum, c) => sum + c.totalCuts, 0)}{" "}
                cuts × $2)
              </div>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Stock Length</th>
                  <th className="px-3 py-2 text-center">Pieces Used</th>
                  <th className="px-3 py-2 text-center">Total Cuts</th>
                  <th className="px-3 py-2 text-right">Setup Fee</th>
                  <th className="px-3 py-2 text-right">Cutting Cost</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {result.costByLength.map((cost) => (
                  <tr key={cost.stockLength}>
                    <td className="px-3 py-2">
                      <strong>{cost.stockLength}mm</strong>
                    </td>
                    <td className="px-3 py-2 text-center">{cost.quantity}</td>
                    <td className="px-3 py-2 text-center">{cost.totalCuts}</td>
                    <td className="px-3 py-2 text-right">
                      ${cost.setupFee.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      ${cost.cuttingCost.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <strong>${cost.totalCost.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={3} className="px-3 py-2">
                    <strong>Total</strong>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <strong>${result.totalSetupFees.toFixed(2)}</strong>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <strong>${result.totalCuttingCosts.toFixed(2)}</strong>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <strong>${result.totalCost.toFixed(2)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      /* Cutting Patterns: Renders each cut pattern with a compact visualization and metrics. Keep markup simple for reliable Playwright snapshots and accessibility (clear headings, small summaries). */
      <section className="rounded shadow-sm bg-white dark:bg-gray-800 p-0">
        <div className="bg-gray-900 text-white px-4 py-3 rounded-t">
          <h5 className="m-0 text-sm font-medium">
            Cutting Patterns ({result.patterns.length} pieces)
          </h5>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            {result.patterns.map((pattern, index) => (
              <li key={index} className="border rounded p-3">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  <div className="lg:col-span-2">
                    <div className="text-indigo-600 font-semibold">
                      Stock #{pattern.stockIndex}
                    </div>
                    <div className="text-xs text-gray-500">
                      {pattern.stockLength}mm stock
                    </div>
                    <div className="text-xs text-gray-500">
                      {pattern.cuts.length} cuts
                    </div>
                  </div>
                  <div className="lg:col-span-7">
                    <CutPatternVisualization pattern={pattern} />
                  </div>
                  <div className="lg:col-span-3">
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-2 py-0.5 rounded text-xs">
                        <span className="text-sm">
                          {formatNumber(pattern.utilization)}%
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-2 py-0.5 rounded text-xs">
                        <span className="text-sm">{pattern.waste}mm waste</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Cuts: {pattern.cuts.join("mm, ")}mm
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <small>
                <strong>Material Efficiency:</strong> Using {result.totalStock}{" "}
                stock pieces with {formatNumber(result.averageUtilization)}%
                average utilization
              </small>
            </div>
            <div className="text-md-right">
              <small>
                <strong>Waste:</strong> {result.totalWaste.toLocaleString()}mm
                total (~
                {formatNumber((result.totalWaste / totalStockLength) * 100)}% of
                material)
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
