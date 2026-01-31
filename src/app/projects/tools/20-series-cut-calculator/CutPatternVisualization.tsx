"use client";

import { ReactElement } from "react";
import { CutPattern } from "@/types/cutCalculator";
import styles from "./CutCalculator.module.scss";

type CutPatternVisualizationProps = {
  pattern: CutPattern;
};

const COLORS = [
  "#10b981", // emerald-500
  "#6366f1", // indigo-500
  "#ec4899", // pink-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
  "#a855f7", // purple-500
  "#0ea5e9", // sky-500
  "#ef4444", // red-500
];

export default function CutPatternVisualization({
  pattern,
}: CutPatternVisualizationProps): ReactElement {
  const getColorForIndex = (index: number): string => {
    return COLORS[index % COLORS.length];
  };

  return (
    <div className={styles.visualization}>
      <div className={styles.stockBar}>
        {pattern.cuts.map((cut, index) => {
          const widthPercent = (cut / pattern.stockLength) * 100;
          return (
            <div
              key={index}
              className={styles.cutSegment}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: getColorForIndex(index),
              }}
              title={`Cut ${index + 1}: ${cut}mm (${widthPercent.toFixed(1)}%)`}
            >
              <span className={styles.cutLabel}>{cut}mm</span>
            </div>
          );
        })}
        {pattern.waste > 0 && (
          <div
            className={`${styles.cutSegment} ${styles.wasteSegment}`}
            style={{
              width: `${(pattern.waste / pattern.stockLength) * 100}%`,
              backgroundColor: "#6c757d",
            }}
            title={`Waste: ${pattern.waste}mm (${(
              (pattern.waste / pattern.stockLength) *
              100
            ).toFixed(1)}%)`}
          >
            <span className={styles.cutLabel}>Waste</span>
          </div>
        )}
      </div>
    </div>
  );
}
