import React from "react";
import { render, screen } from "@testing-library/react";
import StockItemsTable from "../app/projects/tools/20-series-cut-calculator/StockItemsTable";

test("renders StockItemsTable with rows", () => {
  const stockItems = [{ id: "1", length: 3050, quantity: 10 }];
  render(<StockItemsTable stockItems={stockItems} onStockItemsChange={() => {}} maxStockLength={6100} />);
  expect(screen.getByText(/Available Stock/i)).toBeInTheDocument();
  expect(screen.getByText(/#1/)).toBeInTheDocument();
});
