"use client";

/**
 * GroceriesUploader — Upload Woolworths order PDFs for parsing
 */

import { useState, useRef } from "react";

export function GroceriesUploader({ onImported }: { onImported: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; order_number?: string; item_count?: number; total?: number; error?: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setResult({ ok: false, error: "Only PDF files are accepted." });
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.set("file", file);

      const res = await fetch("/api/groceries/parse", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setResult({ ok: false, error: data.error || "Upload failed." });
      } else {
        setResult({ ok: true, order_number: data.order_number, item_count: data.item_count, total: data.total });
        onImported();
      }
    } catch {
      setResult({ ok: false, error: "Could not upload the file." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 className="font-semibold text-lg mb-4">Upload Woolworths order PDF</h2>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <div className="text-4xl mb-3">📄</div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {uploading ? "Parsing receipt..." : "Drop a Woolworths PDF here, or click to browse"}
        </p>
      </div>

      {result && (
        <div className={`mt-4 rounded-xl p-4 text-sm ${
          result.ok
            ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/60 text-green-800 dark:text-green-200"
            : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-200"
        }`}>
          {result.ok ? (
            <>
              <p className="font-medium">✅ Imported successfully</p>
              <p>Order #{result.order_number} — {result.item_count} items, ${result.total?.toFixed(2)}</p>
            </>
          ) : (
            <p>❌ {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
