"use client";

/**
 * AdminSettings — Live config editor for business hours, holidays,
 * vacations, and shipping settings.
 *
 * Replaces the old read-only AdminSettings.tsx with full CRUD.
 */

import { useState, useEffect } from "react";

interface BusinessHourDay {
  day: string;
  start: string;
  end: string;
  closed: boolean;
}

interface Holiday {
  date: string;
  name: string;
}

interface Vacation {
  start: string;
  end: string;
  reason?: string;
}

interface Shipping {
  localDeliveryRadiusKm: number;
  freeLocalDelivery: boolean;
  freePickup: boolean;
}

interface Settings {
  businessHours: BusinessHourDay[];
  holidays: Holiday[];
  vacations: Vacation[];
  shipping: Shipping;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load settings");
        setLoading(false);
      });
  }, []);

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage("✅ Settings saved");
    } catch {
      setMessage("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function updateHours(index: number, patch: Partial<BusinessHourDay>) {
    if (!settings) return;
    const hours = [...settings.businessHours];
    hours[index] = { ...hours[index], ...patch };
    setSettings({ ...settings, businessHours: hours });
  }

  function addHoliday() {
    if (!settings) return;
    setSettings({
      ...settings,
      holidays: [...settings.holidays, { date: "", name: "" }],
    });
  }

  function updateHoliday(index: number, patch: Partial<Holiday>) {
    if (!settings) return;
    const h = [...settings.holidays];
    h[index] = { ...h[index], ...patch };
    setSettings({ ...settings, holidays: h });
  }

  function removeHoliday(index: number) {
    if (!settings) return;
    setSettings({
      ...settings,
      holidays: settings.holidays.filter((_, i) => i !== index),
    });
  }

  function addVacation() {
    if (!settings) return;
    setSettings({
      ...settings,
      vacations: [...settings.vacations, { start: "", end: "", reason: "" }],
    });
  }

  function updateVacation(index: number, patch: Partial<Vacation>) {
    if (!settings) return;
    const v = [...settings.vacations];
    v[index] = { ...v[index], ...patch };
    setSettings({ ...settings, vacations: v });
  }

  function removeVacation(index: number) {
    if (!settings) return;
    setSettings({
      ...settings,
      vacations: settings.vacations.filter((_, i) => i !== index),
    });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!settings) {
    return <div className="p-10 text-red-500">Failed to load settings.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Admin
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight mt-1">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Business hours, holidays, vacations, and shipping configuration.
        </p>
      </div>

      {/* Save bar */}
      <div className="sticky top-4 z-10 mb-6 flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {message && (
          <span
            className={
              message.startsWith("✅")
                ? "text-green-600 text-sm"
                : "text-red-600 text-sm"
            }
          >
            {message}
          </span>
        )}
      </div>

      <div className="space-y-8">
        {/* Business Hours */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Business Hours</h2>
          <div className="grid gap-2">
            {settings.businessHours.map((day, i) => (
              <div
                key={day.day}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-700 p-3"
              >
                <div className="w-24 font-medium capitalize">{day.day}</div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!day.closed}
                    onChange={(e) => updateHours(i, { closed: !e.target.checked })}
                    className="accent-primary"
                  />
                  Open
                </label>
                {!day.closed && (
                  <>
                    <input
                      type="time"
                      value={day.start}
                      onChange={(e) => updateHours(i, { start: e.target.value })}
                      className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <input
                      type="time"
                      value={day.end}
                      onChange={(e) => updateHours(i, { end: e.target.value })}
                      className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Holidays */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Holidays</h2>
            <button
              onClick={addHoliday}
              className="text-sm text-primary hover:underline"
            >
              + Add holiday
            </button>
          </div>
          {settings.holidays.length === 0 && (
            <p className="text-sm text-gray-500">No holidays configured.</p>
          )}
          <div className="space-y-2">
            {settings.holidays.map((h, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 dark:border-gray-700 p-3"
              >
                <input
                  type="date"
                  value={h.date}
                  onChange={(e) => updateHoliday(i, { date: e.target.value })}
                  className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={h.name}
                  onChange={(e) => updateHoliday(i, { name: e.target.value })}
                  placeholder="Holiday name"
                  className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                />
                <button
                  onClick={() => removeHoliday(i)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Vacations */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Vacations / Time Off</h2>
            <button
              onClick={addVacation}
              className="text-sm text-primary hover:underline"
            >
              + Add vacation
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Block out whole days or weeks. Quote turnarounds will
            automatically adjust to skip these periods.
          </p>
          {settings.vacations.length === 0 && (
            <p className="text-sm text-gray-500">No vacations configured.</p>
          )}
          <div className="space-y-2">
            {settings.vacations.map((v, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 dark:border-gray-700 p-3"
              >
                <input
                  type="date"
                  value={v.start}
                  onChange={(e) => updateVacation(i, { start: e.target.value })}
                  className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                  type="date"
                  value={v.end}
                  onChange={(e) => updateVacation(i, { end: e.target.value })}
                  className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={v.reason || ""}
                  onChange={(e) => updateVacation(i, { reason: e.target.value })}
                  placeholder="Reason (optional)"
                  className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-sm"
                />
                <button
                  onClick={() => removeVacation(i)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping & Delivery</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Local delivery radius (km)
              </label>
              <input
                type="number"
                value={settings.shipping.localDeliveryRadiusKm}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: {
                      ...settings.shipping,
                      localDeliveryRadiusKm: Number(e.target.value),
                    },
                  })
                }
                className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm w-24"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.shipping.freeLocalDelivery}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: {
                      ...settings.shipping,
                      freeLocalDelivery: e.target.checked,
                    },
                  })
                }
                className="accent-primary"
              />
              Free local delivery (within radius)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.shipping.freePickup}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: {
                      ...settings.shipping,
                      freePickup: e.target.checked,
                    },
                  })
                }
                className="accent-primary"
              />
              Free pickup available
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
