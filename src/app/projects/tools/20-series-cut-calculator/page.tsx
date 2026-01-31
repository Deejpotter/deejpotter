"use client";

import { ReactElement, useState } from "react";
import styles from "./CutCalculator.module.scss";
import { calculateOptimalCuts } from "@/lib/cutOptimizer";
import {
  CutRequirement,
  StockItem,
  CalculationResult,
} from "@/types/cutCalculator";
import CutRequirementsTable from "./CutRequirementsTable";
import StockItemsTable from "./StockItemsTable";
import ResultsDisplay from "./ResultsDisplay";
import styles from "./CutCalculator.module.scss";

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
    <div className={`${styles.cutCalculator} py-8`}> 
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">20 Series Cut Calculator</h1>
          <p className="text-gray-600">Optimize aluminum extrusion cuts using the Best Fit Decreasing algorithm. Supports multiple stock lengths and accounts for blade kerf to minimize waste.</p>
        </div>

        <div className="mb-6">
          <div className="rounded shadow-sm bg-white dark:bg-gray-800">
            <div className="bg-indigo-600 text-white px-4 py-3 rounded-t">
              <h5 className="m-0 text-sm font-medium">Configuration</h5>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium">Kerf Width (mm) <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  value={kerfWidth}
                  onChange={(e) => setKerfWidth(e.target.value)}
                  placeholder="Enter kerf width (blade thickness)"
                  min={0}
                  step={0.1}
                  aria-label="Kerf width in millimeters"
                  className="mt-1 w-full border rounded px-2 py-1 text-sm"
                />
                <div className="text-xs text-gray-500 mt-1">Blade thickness - accounts for material lost during each cut (typically 3-5mm)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <StockItemsTable
            stockItems={stockItems}
            onStockItemsChange={setStockItems}
            maxStockLength={MAX_STOCK_LENGTH}
          />
        </div>

        <div className="mb-6">
          <CutRequirementsTable
            requirements={requirements}
            onRequirementsChange={setRequirements}
          />
        </div>

        {error && (
          <div className="mb-6">
            <div className="rounded p-3 bg-red-50 text-red-800">{error}</div>
          </div>
        )}

        <div className="mb-6 flex justify-center gap-3">
          <button
            onClick={handleCalculate}
            disabled={requirements.length === 0 || stockItems.length === 0}
            aria-label="Calculate optimal cuts"
            className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
          >
            Calculate Cuts
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset calculator"
            className="px-4 py-2 rounded border"
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
    </div>
  );
}
