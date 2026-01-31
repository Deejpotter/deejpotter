"use client";

import { ReactElement } from "react";
import { StockItem } from "@/types/cutCalculator";

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

  const inputClasses =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Available Stock</h2>
        <button
          type="button"
          onClick={handleAddStockItem}
          aria-label="Add new stock item"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          + Add Stock Length
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-700">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">
                Length (mm) <span className="text-rose-600">*</span>
              </th>
              <th className="px-6 py-3">
                Quantity Available <span className="text-rose-600">*</span>
              </th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
            {stockItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                  No stock items added. Click &quot;Add Stock Length&quot; to start.
                </td>
              </tr>
            ) : (
              stockItems.map((stock) => (
                <tr key={stock.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-semibold text-slate-900">#{stock.id}</td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      value={stock.length || ""}
                      onChange={(e) =>
                        handleUpdateStockItem(stock.id, "length", e.target.value)
                      }
                      placeholder="Stock length"
                      min="1"
                      max={maxStockLength}
                      step="1"
                      aria-label={`Length for stock ${stock.id}`}
                      className={inputClasses}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      value={stock.quantity || ""}
                      onChange={(e) =>
                        handleUpdateStockItem(stock.id, "quantity", e.target.value)
                      }
                      placeholder="Quantity available"
                      min="1"
                      step="1"
                      aria-label={`Quantity for stock ${stock.id}`}
                      className={inputClasses}
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveStockItem(stock.id)}
                      disabled={stockItems.length === 1}
                      aria-label={`Remove stock ${stock.id}`}
                      className="inline-flex items-center justify-center rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-600">
        <span>
          Total stock pieces: {stockItems.reduce((sum, s) => sum + s.quantity, 0)}
        </span>
        <span>
          Total stock length available: {totalStockLength.toLocaleString()}mm
        </span>
      </div>
    </section>
  );
}
