"use client";

import { ReactElement } from "react";
import { StockItem } from "@/types/cutCalculator";

// Converted to Tailwind-only markup (replacing Bootstrap).

type StockItemsTableProps = {
  stockItems: StockItem[];
  onStockItemsChange: (stockItems: StockItem[]) => void;
  maxStockLength: number;
};

export default function StockItemsTable({
  stockItems,
  onStockItemsChange,
  maxStockLength,
}: StockItemsTableProps): ReactElement {
  const handleAddStockItem = (): void => {
    const newId = String(
      Math.max(0, ...stockItems.map((s) => parseInt(s.id) || 0)) + 1
    );
    onStockItemsChange([
      ...stockItems,
      { id: newId, length: maxStockLength, quantity: 10 },
    ]);
  };

  const handleRemoveStockItem = (id: string): void => {
    onStockItemsChange(stockItems.filter((s) => s.id !== id));
  };

  const handleUpdateStockItem = (
    id: string,
    field: "length" | "quantity",
    value: string
  ): void => {
    const numValue = parseFloat(value);
    onStockItemsChange(
      stockItems.map((s) =>
        s.id === id ? { ...s, [field]: isNaN(numValue) ? 0 : numValue } : s
      )
    );
  };

  const totalStockLength = stockItems.reduce(
    (sum, s) => sum + s.length * s.quantity,
    0
  );

  return (
    <div className="rounded shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="flex items-center justify-between bg-sky-600 text-white px-4 py-3 rounded-t">
        <h5 className="m-0 text-sm font-medium">Available Stock</h5>
        <button
          type="button"
          onClick={handleAddStockItem}
          aria-label="Add new stock item"
          className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded bg-white text-black/90 hover:opacity-90"
        >
          <span className="sr-only">Add Stock Length</span>
          <span className="text-lg leading-none">＋</span>
          <span className="text-sm">Add Stock Length</span>
        </button>
      </div>
      <div className="p-0">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
            <tr>
              <th style={{ width: "15%" }}>ID</th>
              <th style={{ width: "35%" }}>
                Length (mm) <span className="text-danger">*</span>
              </th>
              <th style={{ width: "35%" }}>
                Quantity Available <span className="text-danger">*</span>
              </th>
              <th style={{ width: "15%" }} className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {stockItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  No stock items added. Click &quot;Add Stock Length&quot; to
                  start.
                </td>
              </tr>
            ) : (
              stockItems.map((stock) => (
                <tr key={stock.id}>
                  <td className="align-middle">
                    <strong>#{stock.id}</strong>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={stock.length || ""}
                      onChange={(e) => handleUpdateStockItem(stock.id, "length", e.target.value)}
                      placeholder="Stock length"
                      min={1}
                      max={maxStockLength}
                      step={1}
                      aria-label={`Length for stock ${stock.id}`}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={stock.quantity || ""}
                      onChange={(e) => handleUpdateStockItem(stock.id, "quantity", e.target.value)}
                      placeholder="Quantity available"
                      min={1}
                      step={1}
                      aria-label={`Quantity for stock ${stock.id}`}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="text-center align-middle px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveStockItem(stock.id)}
                      disabled={stockItems.length === 1}
                      aria-label={`Remove stock ${stock.id}`}
                      className="inline-flex items-center justify-center p-1 text-sm rounded border border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
        <small>
          Total stock pieces: {" "}
          {stockItems.reduce((sum, s) => sum + s.quantity, 0)} | Total stock
          length available: {totalStockLength.toLocaleString()}mm
        </small>
      </div>
    </div>
  );
}
