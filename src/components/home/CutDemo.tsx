"use client";

import { ReactElement, useMemo, useState } from "react";
import Link from "next/link";
import { calculateOptimalCuts } from "@/app/projects/tools/linear-cut-calculator/cutOptimizer";
import CutPatternVisualization from "@/app/projects/tools/linear-cut-calculator/CutPatternVisualization";

/**
 * A small live run of the linear cut optimiser, so the home page shows a tool
 * working instead of only describing one. It uses the same optimiser as the
 * full calculator and recalculates as the visitor edits the cut list.
 */

const STOCK_LENGTHS = [1000, 1500, 3000];
const KERF = 3;
// Plenty of stock, so the demo answers "how many lengths" rather than "does it fit".
const STOCK_AVAILABLE = 50;

type Row = { id: string; length: number; quantity: number };

const STARTING_ROWS: Row[] = [
  { id: "a", length: 700, quantity: 4 },
  { id: "b", length: 400, quantity: 6 },
  { id: "c", length: 350, quantity: 4 },
];

export default function CutDemo(): ReactElement {
  const [rows, setRows] = useState<Row[]>(STARTING_ROWS);
  const [stockLength, setStockLength] = useState(1500);

  const outcome = useMemo(() => {
    const requirements = rows.filter((row) => row.length > 0 && row.quantity > 0);
    if (requirements.length === 0) return { error: "Add a cut length and quantity." };
    try {
      return {
        result: calculateOptimalCuts({
          stockItems: [{ id: "stock", length: stockLength, quantity: STOCK_AVAILABLE }],
          requirements,
          kerfWidth: KERF,
        }),
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Those cuts can't be planned." };
    }
  }, [rows, stockLength]);

  const updateRow = (id: string, field: "length" | "quantity", value: string) => {
    // Clamp quantities so a stray keypress can't ask for thousands of bars.
    const number = Math.max(0, Math.floor(Number(value) || 0));
    const limited = field === "quantity" ? Math.min(number, 30) : number;
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: limited } : row)));
  };

  const result = outcome.result;
  const usedLength = result ? result.totalStock * stockLength : 0;

  return (
    <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white lg:grid-cols-[0.8fr_1.2fr]">
      <form aria-label="Cut list" onSubmit={(event) => event.preventDefault()} className="space-y-4">
        <label className="block text-sm font-semibold">
          Stock length
          <select
            value={stockLength}
            onChange={(event) => setStockLength(Number(event.target.value))}
            className="mt-1 block w-full rounded-xl border border-white/15 bg-gray-900 px-3 py-2 text-white"
          >
            {STOCK_LENGTHS.map((length) => (
              <option key={length} value={length}>
                {length} mm
              </option>
            ))}
          </select>
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Cuts needed</legend>
          {rows.map((row, index) => (
            <div key={row.id} className="flex items-center gap-2 text-sm">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                aria-label={`Cut ${index + 1} length in mm`}
                value={row.length || ""}
                onChange={(event) => updateRow(row.id, "length", event.target.value)}
                className="w-24 rounded-xl border border-white/15 bg-gray-900 px-3 py-2 text-white"
              />
              <span className="text-white/60">mm ×</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={30}
                aria-label={`Cut ${index + 1} quantity`}
                value={row.quantity || ""}
                onChange={(event) => updateRow(row.id, "quantity", event.target.value)}
                className="w-16 rounded-xl border border-white/15 bg-gray-900 px-3 py-2 text-white"
              />
            </div>
          ))}
        </fieldset>
        <p className="text-xs text-white/50">Allows {KERF} mm for each saw cut.</p>
      </form>

      <div aria-live="polite">
        {result ? (
          <>
            <p className="text-lg font-bold">
              {result.totalStock} × {stockLength} mm lengths, {result.averageUtilization.toFixed(0)}% used
            </p>
            <p className="text-sm text-white/60">
              {Math.round(result.totalWaste)} mm left over from {usedLength} mm of stock
            </p>
            <div className="mt-3 max-h-72 overflow-y-auto pr-1">
              {result.patterns.map((pattern) => (
                <CutPatternVisualization key={pattern.stockIndex} pattern={pattern} />
              ))}
            </div>
          </>
        ) : (
          <p role="alert" className="text-sm text-amber-200">
            {outcome.error}
          </p>
        )}
        <Link
          href="/projects/tools/linear-cut-calculator"
          className="mt-4 inline-block text-sm font-semibold text-emerald-300 hover:underline"
        >
          Open the full cut calculator <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
