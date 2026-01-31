"use client";

import { ReactElement } from "react";
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
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Results Summary</h2>
        </div>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[ 
            { label: "Stock Pieces", value: result.totalStock, accent: "text-emerald-600" },
            { label: "Utilization", value: `${formatNumber(result.averageUtilization)}%`, accent: "text-teal-600" },
            { label: "Total Waste", value: `${result.totalWaste.toLocaleString()}mm`, accent: "text-amber-600" },
            { label: "Calculation Time", value: `${formatNumber(result.executionTime, 2)}ms`, accent: "text-slate-700" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-600">{metric.label}</p>
              <p className={`text-2xl font-semibold ${metric.accent}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Cost Breakdown</h2>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="text-center">
            <p className="text-3xl font-semibold text-emerald-600">
              ${result.totalCost.toFixed(2)}
            </p>
            <p className="text-sm text-slate-500">Total Cost</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center shadow-sm">
              <p className="text-lg font-semibold text-emerald-700">
                ${result.totalSetupFees.toFixed(2)}
              </p>
              <p className="text-sm text-slate-500">Setup Fees</p>
              <p className="text-xs text-slate-500">
                ({result.costByLength.length} unique length
                {result.costByLength.length !== 1 ? "s" : ""} × $3)
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center shadow-sm">
              <p className="text-lg font-semibold text-sky-700">
                ${result.totalCuttingCosts.toFixed(2)}
              </p>
              <p className="text-sm text-slate-500">Cutting Costs</p>
              <p className="text-xs text-slate-500">
                ({result.costByLength.reduce((sum, c) => sum + c.totalCuts, 0)} cuts × $2)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
              <thead className="bg-slate-50 text-left font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Stock Length</th>
                  <th className="px-4 py-3 text-center">Pieces Used</th>
                  <th className="px-4 py-3 text-center">Total Cuts</th>
                  <th className="px-4 py-3 text-right">Setup Fee</th>
                  <th className="px-4 py-3 text-right">Cutting Cost</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {result.costByLength.map((cost) => (
                  <tr key={cost.stockLength} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{cost.stockLength}mm</td>
                    <td className="px-4 py-3 text-center">{cost.quantity}</td>
                    <td className="px-4 py-3 text-center">{cost.totalCuts}</td>
                    <td className="px-4 py-3 text-right">${cost.setupFee.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${cost.cuttingCost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      ${cost.totalCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold text-slate-900">
                <tr>
                  <td className="px-4 py-3" colSpan={3}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right">${result.totalSetupFees.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${result.totalCuttingCosts.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${result.totalCost.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Cutting Patterns ({result.patterns.length} pieces)
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {result.patterns.map((pattern, index) => (
            <div key={index} className="grid gap-4 px-6 py-5 lg:grid-cols-[220px_1fr_220px]">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-700">
                  Stock #{pattern.stockIndex}
                </p>
                <p className="text-sm text-slate-600">{pattern.stockLength}mm stock</p>
                <p className="text-sm text-slate-600">{pattern.cuts.length} cuts</p>
              </div>

              <div>
                <CutPatternVisualization pattern={pattern} />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    Utilization {formatNumber(pattern.utilization)}%
                  </span>
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                    Waste {pattern.waste}mm
                  </span>
                </div>
                <p className="text-sm text-slate-600">Cuts: {pattern.cuts.join("mm, ")}mm</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-600">
          <span>
            <strong className="font-semibold text-slate-900">Material Efficiency:</strong> Using {result.totalStock} stock
            pieces with {formatNumber(result.averageUtilization)}% average utilization
          </span>
          <span>
            <strong className="font-semibold text-slate-900">Waste:</strong> {result.totalWaste.toLocaleString()}mm total (~
            {formatNumber((result.totalWaste / totalStockLength) * 100)}% of material)
          </span>
        </div>
      </section>
    </div>
  );
}
