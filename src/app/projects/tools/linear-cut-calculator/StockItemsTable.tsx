"use client";

import { ReactElement } from "react";
import { StockItem } from "@/types/linear-cut-calculator/cutCalculator";

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
    <div className="bg-white shadow rounded">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
        <h5 className="mb-0">Available Stock</h5>
        <button
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm hover:bg-gray-100"
          onClick={handleAddStockItem}
          aria-label="Add new stock item"
        >
          + Add Stock Length
        </button>
      </div>
      <div className="p-0">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/6 px-4 py-2 text-left">ID</th>
              <th className="w-2/6 px-4 py-2 text-left">
                Length (mm) <span className="text-red-500">*</span>
              </th>
              <th className="w-2/6 px-4 py-2 text-left">
                Quantity Available <span className="text-red-500">*</span>
              </th>
              <th className="w-1/6 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  No stock items added. Click "Add Stock Length" to start.
                </td>
              </tr>
            ) : (
              stockItems.map((stock) => (
                <tr key={stock.id} className="border-t">
                  <td className="px-4 py-2 align-middle">
                    <strong>#{stock.id}</strong>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={stock.length || ""}
                      onChange={(e) =>
                        handleUpdateStockItem(
                          stock.id,
                          "length",
                          e.target.value
                        )
                      }
                      placeholder="Stock length"
                      min="1"
                      max={maxStockLength}
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Length for stock ${stock.id}`}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={stock.quantity || ""}
                      onChange={(e) =>
                        handleUpdateStockItem(
                          stock.id,
                          "quantity",
                          e.target.value
                        )
                      }
                      placeholder="Quantity available"
                      min="1"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Quantity for stock ${stock.id}`}
                    />
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      onClick={() => handleRemoveStockItem(stock.id)}
                      disabled={stockItems.length === 1}
                      aria-label={`Remove stock ${stock.id}`}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 rounded-b">
        <small>
          Total stock pieces:{" "}
          {stockItems.reduce((sum, s) => sum + s.quantity, 0)} | Total stock
          length available: {totalStockLength.toLocaleString()}mm
        </small>
      </div>
    </div>
  );
}
