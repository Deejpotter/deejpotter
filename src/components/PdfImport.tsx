"use client";

import React, { useRef, useState } from "react";
import { Upload, Check } from "lucide-react";

interface PdfImportProps {
  onFileSelected: (file: File) => void;
  onError: (error: string) => void;
  label?: string;
  accept?: string;
}

export default function PdfImport({
  onFileSelected,
  onError,
  label = "Import PDF or Text File",
  accept = ".pdf,.txt,.text",
}: PdfImportProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      onFileSelected(file);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to process file";
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSelected(true);
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSelected(true);
      handleFile(file);
    }
  };

  return (
    <form
      ref={formRef}
      className="mb-4"
      onDragEnter={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <div
        className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition ${dragActive ? "border-primary bg-primary/5" : ""}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            document.getElementById("pdf-import-input")?.click();
          }
        }}
      >
        <div className="p-6 text-center sm:p-8">
          <input
            type="file"
            accept={accept}
            className="hidden"
            id="pdf-import-input"
            onChange={handleFileChange}
            aria-label={label}
          />
          <label htmlFor="pdf-import-input" className="block cursor-pointer">
            <div className="py-3">
              {fileSelected ? (
                <>
                  <div className="mb-3 text-emerald-600">
                    <Check size={48} className="mx-auto" />
                  </div>
                  <h5 className="mb-2 text-xl font-bold">File selected</h5>
                  <p className="text-gray-600 dark:text-gray-400">{fileName}</p>
                </>
              ) : (
                <>
                  <div className="mb-3 text-primary">
                    <Upload size={48} className="mx-auto" />
                  </div>
                  <h5 className="mb-2 text-xl font-bold">{label}</h5>
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag & drop or click to select a .pdf or .txt file
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
      </div>
      {fileSelected && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            onClick={() => {
              setFileSelected(false);
              setFileName(null);
              const fileInput = document.getElementById("pdf-import-input") as HTMLInputElement;
              if (fileInput) fileInput.value = "";
            }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      )}
      {loading && (
        <div className="mt-3 inline-flex items-center gap-2 text-primary">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Processing file...
        </div>
      )}
    </form>
  );
}
