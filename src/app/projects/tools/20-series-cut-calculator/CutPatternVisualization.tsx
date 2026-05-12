"use client";

import { ReactElement } from "react";
import { CutPattern } from "@/types/cutCalculator";

type CutPatternVisualizationProps = {
  pattern: CutPattern;
};

const COLORS = [
  "#0d6efd",
  "#6610f2",
  "#6f42c1",
  "#d63384",
  "#dc3545",
  "#fd7e14",
  "#ffc107",
  "#198754",
  "#20c997",
  "#0dcaf0",
];

export default function CutPatternVisualization({
  pattern,
}: CutPatternVisualizationProps): ReactElement {
  const getColorForIndex = (index: number): string => COLORS[index % COLORS.length];

  return (
    <div className="w-full py-2">
      <div className="flex h-10 w-full overflow-hidden rounded-xl border border-gray-300 shadow-inner dark:border-gray-700 md:h-9 max-sm:h-8 print:border-black">
        {pattern.cuts.map((cut, index) => {
          const widthPercent = (cut / pattern.stockLength) * 100;
          return (
            <div
              key={index}
              className="flex items-center justify-center border-r border-white text-[0.65rem] font-semibold text-white shadow-sm transition hover:scale-y-110 hover:shadow-md md:text-xs max-sm:text-[0.6rem] print:border-black"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: getColorForIndex(index),
              }}
              title={`Cut ${index + 1}: ${cut}mm (${widthPercent.toFixed(1)}%)`}
            >
              <span className="truncate px-1">{cut}mm</span>
            </div>
          );
        })}
        {pattern.waste > 0 && (
          <div
            className="flex items-center justify-center border-r border-white text-[0.65rem] font-semibold text-white shadow-sm transition hover:scale-y-110 hover:shadow-md md:text-xs max-sm:text-[0.6rem] print:border-black"
            style={{
              width: `${(pattern.waste / pattern.stockLength) * 100}%`,
              background:
                "repeating-linear-gradient(45deg, #6c757d, #6c757d 10px, #5a6268 10px, #5a6268 20px)",
            }}
            title={`Waste: ${pattern.waste}mm (${((pattern.waste / pattern.stockLength) * 100).toFixed(1)}%)`}
          >
            <span className="truncate px-1">Waste</span>
          </div>
        )}
      </div>
    </div>
  );
}
