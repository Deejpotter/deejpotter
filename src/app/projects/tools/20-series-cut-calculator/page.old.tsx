"use client";

import { ReactElement, useState } from "react";
import styles from "./CutCalculator.module.scss";
import { calculateOptimalCuts } from "@/lib/cutOptimizer";
import {
  CutRequirement,
  CalculationResult,
  ValidationError,
} from "@/types/cutCalculator";
import CutRequirementsTable from "./CutRequirementsTable";
import ResultsDisplay from "./ResultsDisplay";
import styles from "./CutCalculator.module.scss";

export default function CutCalculatorPage(): ReactElement {
  const [stockLength, setStockLength] = useState<string>("6000");
  const [algorithm, setAlgorithm] = useState<string>("FFD");
  const [requirements, setRequirements] = useState<CutRequirement[]>([
    { id: "1", length: 450, quantity: 4 },
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = (): void => {
    setError("");
    setResult(null);

    const stockLengthNum = parseFloat(stockLength);
    if (isNaN(stockLengthNum) || stockLengthNum <= 0) {
      setError("Please enter a valid stock length greater than 0.");
      return;
    }

    try {
      const calculationResult = calculateOptimalCuts({
        stockItems: [{ id: "default", length: stockLengthNum, quantity: 1000 }],
        requirements,
        kerfWidth: 0,
      });
      setResult(calculationResult);
    } catch (err) {
      if (Array.isArray(err)) {
        // ValidationError[]
        const errors = err as ValidationError[];
        setError(errors.map((e) => `${e.field}: ${e.message}`).join(", "));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during calculation.");
      }
    }
  };

  const handleReset = (): void => {
    setStockLength("6000");
    setAlgorithm("FFD");
    setRequirements([{ id: "1", length: 450, quantity: 4 }]);
    setResult(null);
    setError("");
  };

  return (
    <div className={`${styles.cutCalculator} py-8`}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">20 Series Cut Calculator</h1>
          <p className="text-gray-600">Optimize aluminum extrusion cuts using advanced bin packing algorithms. Minimize waste and maximize material utilization.</p>
        </div>

        <div className="mb-6">
          <div className="rounded shadow-sm bg-white dark:bg-gray-800">
            <div className="bg-indigo-600 text-white px-4 py-3 rounded-t">
              <h5 className="m-0 text-sm font-medium">Configuration</h5>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Stock Length (mm) <span className="text-red-600">*</span></label>
                <input type="number" value={stockLength} onChange={(e) => setStockLength(e.target.value)} className="mt-1 w-full border rounded px-2 py-1 text-sm" />
                <div className="text-xs text-gray-500 mt-1">Standard 20 series length: 6000mm</div>
              </div>

              <div>
                <label className="block text-sm font-medium">Algorithm <span className="text-red-600">*</span></label>
                <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as string)} className="mt-1 w-full border rounded px-2 py-1 text-sm">
                  <option value="FFD">First Fit Decreasing (Faster)</option>
                  <option value="BFD">Best Fit Decreasing (More Efficient)</option>
                </select>
                <div className="text-xs text-gray-500 mt-1">FFD is faster, BFD may produce tighter packing</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <CutRequirementsTable requirements={requirements} onRequirementsChange={setRequirements} />
        </div>

        {error && (
          <div className="mb-6">
            <div className="rounded p-3 bg-red-50 text-red-800">{error}</div>
          </div>
        )}

        <div className="mb-6 flex justify-center gap-3">
          <button onClick={handleCalculate} disabled={requirements.length === 0} aria-label="Calculate optimal cuts" className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50">Calculate Cuts</button>
          <button onClick={handleReset} aria-label="Reset calculator" className="px-4 py-2 rounded border">Reset</button>
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
