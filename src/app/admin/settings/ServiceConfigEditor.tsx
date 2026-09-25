"use client";

/**
 * ServiceConfigEditor — Admin UI to manage materials, pricing,
 * and settings per service type (3D printing, laser, milling).
 *
 * Loads from /api/admin/service-config and saves via PATCH.
 */

import { useState, useEffect } from "react";

interface Material {
  id: string;
  label: string;
  fullName: string;
  ratePerGram: number | null;
  density: number | null;
  description: string;
  colors: string[];
  suggested: boolean;
  enabled: boolean;
}

interface ServiceConfig {
  serviceType: string;
  enabled: boolean;
  displayName: string;
  materials: Material[];
  settings: Record<string, unknown>;
}

const SERVICE_TABS = [
  { id: "3d_printing", label: "3D Printing" },
  { id: "laser", label: "Laser" },
  { id: "milling", label: "CNC Milling" },
];

let newMaterialIdCounter = 0;

export default function ServiceConfigEditor() {
  const [configs, setConfigs] = useState<ServiceConfig[]>([]);
  const [activeTab, setActiveTab] = useState("3d_printing");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [addingMaterial, setAddingMaterial] = useState(false);

  useEffect(() => {
    fetch("/api/admin/service-config")
      .then((r) => r.json())
      .then((data) => {
        setConfigs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeConfig = configs.find((c) => c.serviceType === activeTab);

  function updateConfig(patch: Partial<ServiceConfig>) {
    setConfigs((prev) =>
      prev.map((c) =>
        c.serviceType === activeTab ? { ...c, ...patch } : c,
      ),
    );
  }

  function updateMaterial(index: number, patch: Partial<Material>) {
    if (!activeConfig) return;
    const materials = [...activeConfig.materials];
    materials[index] = { ...materials[index], ...patch };
    updateConfig({ materials });
  }

  function removeMaterial(index: number) {
    if (!activeConfig) return;
    updateConfig({
      materials: activeConfig.materials.filter((_, i) => i !== index),
    });
  }

  function addMaterial() {
    if (!activeConfig) return;
    const newId = `new_material_${++newMaterialIdCounter}`;
    updateConfig({
      materials: [
        ...activeConfig.materials,
        {
          id: newId,
          label: "",
          fullName: "",
          ratePerGram: null,
          density: null,
          description: "",
          colors: [],
          suggested: false,
          enabled: true,
        },
      ],
    });
    setAddingMaterial(true);
  }

  async function save() {
    if (!activeConfig) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/service-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: activeTab,
          enabled: activeConfig.enabled,
          materials: activeConfig.materials,
          settings: activeConfig.settings,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setMessage("✅ Saved");
      setAddingMaterial(false);
    } catch {
      setMessage("❌ Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updateSetting(key: string, value: unknown) {
    if (!activeConfig) return;
    updateConfig({
      settings: { ...activeConfig.settings, [key]: value },
    });
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Admin
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight mt-1">
          Service Config
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage materials, pricing, and settings per service type.
        </p>
      </div>

      {/* Save bar */}
      <div className="sticky top-4 z-10 mb-6 flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {message && (
          <span
            className={message.startsWith("✅") ? "text-green-600 text-sm" : "text-red-600 text-sm"}
          >
            {message}
          </span>
        )}
      </div>

      {/* Service tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {SERVICE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setAddingMaterial(false);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-800 border border-b-white dark:border-b-gray-800 border-gray-200 dark:border-gray-700 text-primary"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeConfig && (
        <div className="space-y-6">
          {/* Enable/disable */}
          <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={activeConfig.enabled}
                onChange={(e) => updateConfig({ enabled: e.target.checked })}
                className="accent-primary w-5 h-5"
              />
              <span className="font-medium">
                {activeConfig.displayName} service enabled
              </span>
            </label>
          </section>

          {/* Pricing settings */}
          <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hourly rate (AUD)
                </label>
                <input
                  type="number"
                  value={(activeConfig.settings.hourlyRate as number) || 5}
                  onChange={(e) => updateSetting("hourlyRate", Number(e.target.value))}
                  className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm w-24"
                />
              </div>
              {activeTab !== "3d_printing" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Cut price per mm (AUD)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={(activeConfig.settings.cutPricePerMm as number) || 0.05}
                      onChange={(e) => updateSetting("cutPricePerMm", Number(e.target.value))}
                      className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm w-32"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Engrave price per mm² (AUD)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={(activeConfig.settings.engravePricePerMm2 as number) || 0.001}
                      onChange={(e) => updateSetting("engravePricePerMm2", Number(e.target.value))}
                      className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm w-32"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Setup fee (AUD)
                </label>
                <input
                  type="number"
                  value={(activeConfig.settings.setupFee as number) || 0}
                  onChange={(e) => updateSetting("setupFee", Number(e.target.value))}
                  className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm w-24"
                />
              </div>
            </div>
          </section>

          {/* Materials */}
          <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Materials</h2>
              <button
                onClick={addMaterial}
                disabled={addingMaterial}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                + Add material
              </button>
            </div>
            <div className="space-y-4">
              {activeConfig.materials.map((mat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        ID
                      </label>
                      <input
                        type="text"
                        value={mat.id}
                        onChange={(e) => updateMaterial(i, { id: e.target.value })}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={mat.label}
                        onChange={(e) => updateMaterial(i, { label: e.target.value })}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={mat.fullName}
                        onChange={(e) => updateMaterial(i, { fullName: e.target.value })}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {activeTab === "3d_printing" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Rate/g (AUD)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={mat.ratePerGram ?? ""}
                            onChange={(e) =>
                              updateMaterial(i, {
                                ratePerGram: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Density
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={mat.density ?? ""}
                            onChange={(e) =>
                              updateMaterial(i, {
                                density: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Colors
                      </label>
                      <input
                        type="text"
                        value={mat.colors.join(", ")}
                        onChange={(e) =>
                          updateMaterial(i, {
                            colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Black, White, Grey"
                        className="w-64 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={mat.enabled}
                        onChange={(e) => updateMaterial(i, { enabled: e.target.checked })}
                        className="accent-primary"
                      />
                      Enabled
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={mat.suggested}
                        onChange={(e) => updateMaterial(i, { suggested: e.target.checked })}
                        className="accent-primary"
                      />
                      Suggested
                    </label>
                    {mat.id !== "other" && (
                      <button
                        onClick={() => removeMaterial(i)}
                        className="text-red-500 text-sm hover:underline ml-auto"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={mat.description}
                      onChange={(e) => updateMaterial(i, { description: e.target.value })}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
