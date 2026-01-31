import React from "react";
import ResultsDisplay from "@/app/projects/tools/20-series-cut-calculator/ResultsDisplay";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ResultsDisplay> = {
  title: "Cut Calculator/ResultsDisplay",
  component: ResultsDisplay,
};

export default meta;

type Story = StoryObj<typeof ResultsDisplay>;

const sampleResult = {
  totalStock: 12,
  averageUtilization: 82.3,
  totalWaste: 350,
  executionTime: 12.34,
  totalCost: 123.45,
  totalSetupFees: 36,
  totalCuttingCosts: 78,
  costByLength: [
    { stockLength: 3050, quantity: 8, totalCuts: 24, setupFee: 24, cuttingCost: 48, totalCost: 72 },
    { stockLength: 6100, quantity: 4, totalCuts: 8, setupFee: 12, cuttingCost: 30, totalCost: 42 },
  ],
  patterns: [
    { stockIndex: 1, stockLength: 3050, cuts: [450, 1200, 450], utilization: 87.4, waste: 67 },
    { stockIndex: 2, stockLength: 6100, cuts: [1200, 1200, 450], utilization: 75.1, waste: 150 },
  ],
};

export const Default: Story = {
  args: {
    result: sampleResult,
  },
};

export const Empty: Story = {
  args: {
    result: { ...sampleResult, costByLength: [], patterns: [], totalStock: 0, totalCost: 0, totalWaste: 0 },
  },
};
