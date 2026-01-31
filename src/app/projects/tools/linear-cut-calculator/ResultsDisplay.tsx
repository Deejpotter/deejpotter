"use client";

import { ReactElement } from "react";
import { CalculationResult } from "@/types/linear-cut-calculator/cutCalculator";
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
      <div className="bg-white shadow rounded mb-4">
        <div className="bg-blue-600 text-white p-4 rounded-t">
          <h5 className="mb-0">Results Summary</h5>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center border border-blue-500 rounded p-4">
              <h6 className="text-gray-600 mb-2">Stock Pieces</h6>
              <h2 className="text-blue-600 mb-0">{result.totalStock}</h2>
            </div>
            <div className="text-center border border-green-500 rounded p-4">
              <h6 className="text-gray-600 mb-2">Utilization</h6>
              <h2 className="text-green-600 mb-0">
                {formatNumber(result.averageUtilization)}%
              </h2>
            </div>
            <div className="text-center border border-yellow-500 rounded p-4">
              <h6 className="text-gray-600 mb-2">Total Waste</h6>
              <h2 className="text-yellow-600 mb-0">
                {result.totalWaste.toLocaleString()}mm
              </h2>
            </div>
            <div className="text-center border border-gray-500 rounded p-4">
              <h6 className="text-gray-600 mb-2">Calculation Time</h6>
              <h2 className="text-gray-600 mb-0">
                {formatNumber(result.executionTime, 2)}ms
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Card */}
      <div className="bg-white shadow rounded mb-4">
        <div className="bg-green-600 text-white p-4 rounded-t">
          <h5 className="mb-0">Cost Breakdown</h5>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <div className="text-center">
              <h3 className="text-green-600 mb-0">
                ${result.totalCost.toFixed(2)}
              </h3>
              <p className="text-gray-600 text-sm mb-0">Total Cost</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="text-center border rounded p-2">
              <h5 className="text-blue-600 mb-0">
                ${result.totalSetupFees.toFixed(2)}
              </h5>
              <small className="text-gray-600">Setup Fees</small>
              <div className="text-sm text-gray-600">
                ({result.costByLength.length} unique length
                {result.costByLength.length !== 1 ? "s" : ""} × $3)
              </div>
            </div>
            <div className="text-center border rounded p-2">
              <h5 className="text-blue-600 mb-0">
                ${result.totalCuttingCosts.toFixed(2)}
              </h5>
              <small className="text-gray-600">Cutting Costs</small>
              <div className="text-sm text-gray-600">
                ({result.costByLength.reduce((sum, c) => sum + c.totalCuts, 0)}{" "}
                cuts × $2)
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Stock Length</th>
                  <th className="px-4 py-2 text-center">Pieces Used</th>
                  <th className="px-4 py-2 text-center">Total Cuts</th>
                  <th className="px-4 py-2 text-right">Setup Fee</th>
                  <th className="px-4 py-2 text-right">Cutting Cost</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {result.costByLength.map((cost) => (
                  <tr key={cost.stockLength} className="border-t">
                    <td className="px-4 py-2">
                      <strong>{cost.stockLength}mm</strong>
                    </td>
                    <td className="px-4 py-2 text-center">{cost.quantity}</td>
                    <td className="px-4 py-2 text-center">{cost.totalCuts}</td>
                    <td className="px-4 py-2 text-right">
                      ${cost.setupFee.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${cost.cuttingCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <strong>${cost.totalCost.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-2">
                    <strong>Total</strong>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <strong>${result.totalSetupFees.toFixed(2)}</strong>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <strong>${result.totalCuttingCosts.toFixed(2)}</strong>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <strong>${result.totalCost.toFixed(2)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded">
        <div className="bg-gray-800 text-white p-4 rounded-t">
          <h5 className="mb-0">
            Cutting Patterns ({result.patterns.length} pieces)
          </h5>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {result.patterns.map((pattern, index) => (
              <div key={index} className="border rounded p-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  <div className="lg:col-span-2">
                    <strong className="text-blue-600">
                      Stock #{pattern.stockIndex}
                    </strong>
                    <div className="text-sm text-gray-600">
                      {pattern.stockLength}mm stock
                    </div>
                    <div className="text-sm text-gray-600">
                      {pattern.cuts.length} cuts
                    </div>
                  </div>
                  <div className="lg:col-span-7">
                    <CutPatternVisualization pattern={pattern} />
                  </div>
                  <div className="lg:col-span-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {formatNumber(pattern.utilization)}%
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                        {pattern.waste}mm waste
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Cuts: {pattern.cuts.join("mm, ")}mm
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 rounded-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <small>
                <strong>Material Efficiency:</strong> Using {result.totalStock}{" "}
                stock pieces with {formatNumber(result.averageUtilization)}%
                average utilization
              </small>
            </div>
            <div className="text-right">
              <small>
                <strong>Waste:</strong> {result.totalWaste.toLocaleString()}mm
                total (~
                {formatNumber((result.totalWaste / totalStockLength) * 100)}% of
                material)
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
