"use client";

import { ReactElement } from "react";
import { CutRequirement } from "@/types/cutCalculator";

// CutRequirementsTable
// Purpose: Display and manage the list of cut requirements for the 20-series calculator.
// Rationale: Implemented with Tailwind utilities to keep styles framework-agnostic and
// to support Storybook-first development. Keep the component focused on UI + local
// state management for user edits and expose changes via `onRequirementsChange`.
// Storybook: `src/stories/CutRequirementsTable.stories.tsx` demonstrates usage scenarios.

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

  return (
    <div className="rounded shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="flex items-center justify-between bg-emerald-600 text-white px-4 py-3 rounded-t">
        <h5 className="m-0 text-sm font-medium">Cut Requirements</h5>
        {/* Add Row: intentionally a small, accessible button. Keep visuals minimal and rely on Storybook to demonstrate variants. */}
        <button
          type="button"
          onClick={handleAddRequirement}
          aria-label="Add new cut requirement"
          className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded bg-white text-black/90 hover:opacity-90"
        >
          <span className="sr-only">Add Row</span>
          <span className="text-lg leading-none">＋</span>
          <span className="text-sm">Add Row</span>
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
                  Quantity <span className="text-danger">*</span>
                </th>
                <th style={{ width: "15%" }} className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {requirements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    No requirements added. Click &quot;Add Row&quot; to start.
                  </td>
                </tr>
              ) : (
                requirements.map((req) => (
                  <tr key={req.id}>
                    <td className="align-middle">
                      <strong>#{req.id}</strong>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={req.length || ""}
                        onChange={(e) =>
                          handleUpdateRequirement(
                            req.id,
                            "length",
                            e.target.value
                          )
                        }
                        placeholder="Cut length"
                        min={1}
                        step={1}
                        aria-label={`Length for requirement ${req.id}`}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={req.quantity || ""}
                        onChange={(e) =>
                          handleUpdateRequirement(
                            req.id,
                            "quantity",
                            e.target.value
                          )
                        }
                        placeholder="Quantity"
                        min={1}
                        step={1}
                        aria-label={`Quantity for requirement ${req.id}`}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="text-center align-middle px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(req.id)}
                        disabled={requirements.length === 1}
                        aria-label={`Remove requirement ${req.id}`}
                        className="inline-flex items-center justify-center p-1 text-sm rounded border border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        ✖
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
        <small>
          Total cuts: {requirements.reduce((sum, r) => sum + r.quantity, 0)} |
          Total length needed:{" "}
          {requirements
            .reduce((sum, r) => sum + r.length * r.quantity, 0)
            .toLocaleString()}
          mm
        </small>
      </div>
    </div>
  );
}
