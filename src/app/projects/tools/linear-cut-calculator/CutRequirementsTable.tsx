"use client";

import { ReactElement } from "react";
import { CutRequirement } from "@/types/linear-cut-calculator/cutCalculator";

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
    <div className="bg-white shadow rounded">
      <div className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t">
        <h5 className="mb-0">Cut Requirements</h5>
        <button
          className="bg-white text-green-600 px-3 py-1 rounded text-sm hover:bg-gray-100"
          onClick={handleAddRequirement}
          aria-label="Add new cut requirement"
        >
          <i className="fas fa-plus mr-1"></i>
          Add Row
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
                Quantity <span className="text-red-500">*</span>
              </th>
              <th className="w-1/6 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requirements.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  No requirements added. Click "Add Row" to start.
                </td>
              </tr>
            ) : (
              requirements.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-2 align-middle">
                    <strong>#{req.id}</strong>
                  </td>
                  <td className="px-4 py-2">
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
                      min="1"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Length for requirement ${req.id}`}
                    />
                  </td>
                  <td className="px-4 py-2">
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
                      min="1"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Quantity for requirement ${req.id}`}
                    />
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      onClick={() => handleRemoveRequirement(req.id)}
                      disabled={requirements.length === 1}
                      aria-label={`Remove requirement ${req.id}`}
                    >
                      <i className="fas fa-trash"></i>
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
