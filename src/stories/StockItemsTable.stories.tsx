import React from "react";
import StockItemsTable from "@/app/projects/tools/20-series-cut-calculator/StockItemsTable";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof StockItemsTable> = {
  title: "Cut Calculator/StockItemsTable",
  component: StockItemsTable,
};

export default meta;

type Story = StoryObj<typeof StockItemsTable>;

const sampleStock = [
  { id: "1", length: 3050, quantity: 10 },
  { id: "2", length: 6100, quantity: 5 },
];

export const Default: Story = {
  args: {
    stockItems: sampleStock,
    onStockItemsChange: () => {},
    maxStockLength: 6100,
  },
};

export const Empty: Story = {
  args: {
    stockItems: [],
    onStockItemsChange: () => {},
    maxStockLength: 3050,
  },
};
