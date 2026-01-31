"use client";

import { ReactElement } from "react";
import { CutRequirement } from "@/types/cutCalculator";

type CutRequirementsTableProps = {
  requirements: CutRequirement[];
  onRequirementsChange: (requirements: CutRequirement[]) => void;
};

export default function CutRequirementsTable({
  requirements,
  onRequirementsChange,
}: CutRequirementsTableProps): ReactElement {
  const handleAddRequirement = (): void => {
    const newId = String(
      Math.max(0, ...requirements.map((r) => parseInt(r.id) || 0)) + 1
    );
    onRequirementsChange([
      ...requirements,
      { id: newId, length: 0, quantity: 1 },
    ]);
  };

  const handleRemoveRequirement = (id: string): void => {
    onRequirementsChange(requirements.filter((r) => r.id !== id));
  };

  const handleUpdateRequirement = (
    id: string,
    field: "length" | "quantity",
    value: string
  ): void => {
    const numValue = parseFloat(value);
    onRequirementsChange(
      requirements.map((r) =>
        r.id === id ? { ...r, [field]: isNaN(numValue) ? 0 : numValue } : r
      )
    );
  };

  const inputClasses =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Cut Requirements</h2>
        <button
          type="button"
          onClick={handleAddRequirement}
          aria-label="Add new cut requirement"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          + Add Row
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
                Quantity <span className="text-rose-600">*</span>
              </th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
            {requirements.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                  No requirements added. Click &quot;Add Row&quot; to start.
                </td>
              </tr>
            ) : (
              requirements.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-semibold text-slate-900">#{req.id}</td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      value={req.length || ""}
                      onChange={(e) =>
                        handleUpdateRequirement(req.id, "length", e.target.value)
                      }
                      placeholder="Cut length"
                      min="1"
                      step="1"
                      aria-label={`Length for requirement ${req.id}`}
                      className={inputClasses}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      value={req.quantity || ""}
                      onChange={(e) =>
                        handleUpdateRequirement(req.id, "quantity", e.target.value)
                      }
                      placeholder="Quantity"
                      min="1"
                      step="1"
                      aria-label={`Quantity for requirement ${req.id}`}
                      className={inputClasses}
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(req.id)}
                      disabled={requirements.length === 1}
                      aria-label={`Remove requirement ${req.id}`}
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
        <span>Total cuts: {requirements.reduce((sum, r) => sum + r.quantity, 0)}</span>
        <span>
          Total length needed: {requirements.reduce((sum, r) => sum + r.length * r.quantity, 0).toLocaleString()}mm
        </span>
      </div>
    </section>
  );
}
