"use client";

import { ReactElement, useState } from "react";
import { calculateOptimalCuts } from "@/lib/cutOptimizer";
import {
  CutRequirement,
  StockItem,
  CalculationResult,
} from "@/types/cutCalculator";
import CutRequirementsTable from "./CutRequirementsTable";
import StockItemsTable from "./StockItemsTable";
import ResultsDisplay from "./ResultsDisplay";

const DEFAULT_KERF_WIDTH = 4; // 4mm kerf for standard cutting blade
const MAX_STOCK_LENGTH = 3050; // Maximum standard stock length

export default function CutCalculatorPage(): ReactElement {
  const [kerfWidth, setKerfWidth] = useState<string>(String(DEFAULT_KERF_WIDTH));
  const [stockItems, setStockItems] = useState<StockItem[]>([
    { id: "1", length: 3050, quantity: 10 },
  ]);
  const [requirements, setRequirements] = useState<CutRequirement[]>([
    { id: "1", length: 450, quantity: 4 },
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = (): void => {
    setError("");
    setResult(null);

    const kerfWidthNum = parseFloat(kerfWidth);
    if (isNaN(kerfWidthNum) || kerfWidthNum < 0) {
      setError("Please enter a valid kerf width (0 or greater).");
      return;
    }

    try {
      const calculationResult = calculateOptimalCuts({
        stockItems,
        requirements,
        kerfWidth: kerfWidthNum,
      });
      setResult(calculationResult);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during calculation.");
      }
    }
  };

  const handleReset = (): void => {
    setKerfWidth(String(DEFAULT_KERF_WIDTH));
    setStockItems([{ id: "1", length: 3050, quantity: 10 }]);
    setRequirements([{ id: "1", length: 450, quantity: 4 }]);
    setResult(null);
    setError("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-bold text-slate-900">20 Series Cut Calculator</h1>
        <p className="text-base text-slate-600">
          Optimize aluminum extrusion cuts using the Best Fit Decreasing algorithm. Supports
          multiple stock lengths and accounts for blade kerf to minimize waste.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
        </div>
        <div className="px-6 py-5">
          <label className="block text-sm font-medium text-slate-800">
            Kerf Width (mm)
            <span className="text-rose-600">*</span>
            <input
              type="number"
              value={kerfWidth}
              onChange={(e) => setKerfWidth(e.target.value)}
              placeholder="Enter kerf width (blade thickness)"
              min="0"
              step="0.1"
              aria-label="Kerf width in millimeters"
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>
          <p className="mt-2 text-sm text-slate-500">
            Blade thickness — accounts for material lost during each cut (typically 3-5mm).
          </p>
        </div>
      </section>

      <StockItemsTable
        stockItems={stockItems}
        onStockItemsChange={setStockItems}
        maxStockLength={MAX_STOCK_LENGTH}
      />

      <CutRequirementsTable
        requirements={requirements}
        onRequirementsChange={setRequirements}
      />

      {error && (
        <div className="overflow-hidden rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Validation Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-md p-1 text-rose-500 transition hover:bg-rose-100"
              aria-label="Dismiss validation error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={handleCalculate}
          disabled={requirements.length === 0 || stockItems.length === 0}
          aria-label="Calculate optimal cuts"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Calculate Cuts
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset calculator"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Reset
        </button>
      </div>

      {result && <ResultsDisplay result={result} />}
    </div>
  );
}
