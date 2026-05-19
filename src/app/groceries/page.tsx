"use client";

/**
 * GroceriesPage — Client page that wraps uploader + dashboard with refresh coordination
 */

import { useState, useCallback } from "react";
import { GroceriesDashboard } from "./GroceriesDashboard";
import { GroceriesUploader } from "./GroceriesUploader";

export default function GroceriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleImported = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 sm:py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Finance</p>
        <h1 className="text-4xl font-extrabold tracking-tight mt-1">Groceries Spend Visualiser</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
          Upload Woolworths order PDFs to track spending by category, store, and month.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div>
          <GroceriesUploader onImported={handleImported} />
          <BatchImportButton onImported={handleImported} />
        </div>
        <div>
          <GroceriesDashboard refreshKey={refreshKey} />
        </div>
      </div>
    </main>
  );
}

function BatchImportButton({ onImported }: { onImported: () => void }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; imported?: number; skipped?: number; errors?: number; error?: string } | null>(null);

  const handleBatch = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/groceries/batch-import", { method: "POST" });
      const data = await res.json();
      setResult(data);
      if (res.ok) onImported();
    } catch {
      setResult({ ok: false, error: "Batch import failed." });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleBatch}
        disabled={running}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors disabled:opacity-50"
      >
        {running ? "Importing..." : "📦 Batch import all Woolworths PDFs"}
      </button>
      {result && (
        <div className={`mt-2 rounded-lg p-3 text-xs ${
          result.ok
            ? "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
            : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
        }`}>
          {result.ok
            ? `Imported: ${result.imported}, Skipped: ${result.skipped}, Errors: ${result.errors}`
            : `Error: ${result.error}`}
        </div>
      )}
    </div>
  );
}
