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

const DEFAULT_KERF_WIDTH = 4;
const MAX_STOCK_LENGTH = 3050;

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
      setError(err instanceof Error ? err.message : "An unexpected error occurred during calculation.");
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">20 Series Cut Calculator</h1>
        <p className="mx-auto mt-3 max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-300">
          Optimize aluminum extrusion cuts using the Best Fit Decreasing algorithm. Supports multiple stock lengths and accounts for blade kerf to minimize waste.
        </p>
      </div>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="bg-primary px-5 py-4 text-white">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Configuration</h2>
          </div>
          <div className="p-5">
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
              Kerf Width (mm) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              value={kerfWidth}
              onChange={(e) => setKerfWidth(e.target.value)}
              placeholder="Enter kerf width (blade thickness)"
              min={0}
              step={0.1}
              aria-label="Kerf width in millimeters"
              className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950/40 dark:text-white"
            />
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Blade thickness - accounts for material lost during each cut (typically 3-5mm)
            </p>
          </div>
        </section>

        <StockItemsTable stockItems={stockItems} onStockItemsChange={setStockItems} maxStockLength={MAX_STOCK_LENGTH} />
        <CutRequirementsTable requirements={requirements} onRequirementsChange={setRequirements} />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleCalculate}
            disabled={requirements.length === 0 || stockItems.length === 0}
            aria-label="Calculate optimal cuts"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calculate Cuts
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset calculator"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Reset
          </button>
        </div>

        {result && <ResultsDisplay result={result} />}
      </div>
    </div>
  );
}
