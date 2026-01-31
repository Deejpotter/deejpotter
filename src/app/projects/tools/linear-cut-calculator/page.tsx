"use client";

import { ReactElement, useState } from "react";
import { calculateOptimalCuts } from "./cutOptimizer";
import {
  CutRequirement,
  StockItem,
  CalculationResult,
} from "@/types/linear-cut-calculator/cutCalculator";
import CutRequirementsTable from "./CutRequirementsTable";
import StockItemsTable from "./StockItemsTable";
import ResultsDisplay from "./ResultsDisplay";

const DEFAULT_KERF_WIDTH = 4; // 4mm kerf for standard cutting blade
const MAX_STOCK_LENGTH = 3050; // Maximum standard stock length

export default function CutCalculatorPage(): ReactElement {
  const [kerfWidth, setKerfWidth] = useState<string>(
    String(DEFAULT_KERF_WIDTH)
  );
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
    <div className="max-w-7xl mx-auto py-5 px-4">
      <div className="mb-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Linear Cut Calculator</h1>
          <p className="text-gray-600">
            Optimize aluminum extrusion cuts using the Best Fit Decreasing
            algorithm. Supports multiple stock lengths and accounts for blade
            kerf to minimize waste.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full">
          <div className="bg-white shadow rounded">
            <div className="bg-blue-600 text-white p-4 rounded-t">
              <h5 className="mb-0">Configuration</h5>
            </div>
            <div className="p-4">
              <div className="w-full mb-3">
                <label className="block text-sm font-medium mb-1">
                  Kerf Width (mm)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={kerfWidth}
                  onChange={(e) => setKerfWidth(e.target.value)}
                  placeholder="Enter kerf width (blade thickness)"
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Kerf width in millimeters"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Blade thickness - accounts for material lost during each cut
                  (typically 3-5mm)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <StockItemsTable
          stockItems={stockItems}
          onStockItemsChange={setStockItems}
          maxStockLength={MAX_STOCK_LENGTH}
        />
      </div>

      <div className="mb-4">
        <CutRequirementsTable
          requirements={requirements}
          onRequirementsChange={setRequirements}
        />
      </div>

      {error && (
        <div className="mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Validation Error</strong>
            <p className="mb-0">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-4 flex justify-center gap-3">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleCalculate}
          disabled={requirements.length === 0 || stockItems.length === 0}
          aria-label="Calculate optimal cuts"
        >
          Calculate Cuts
        </button>
        <button
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50"
          onClick={handleReset}
          aria-label="Reset calculator"
        >
          Reset
        </button>
      </div>

      {result && (
        <div>
          <ResultsDisplay result={result} />
        </div>
      )}
    </div>
  );
}
