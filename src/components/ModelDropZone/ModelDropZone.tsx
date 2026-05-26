"use client";

/**
 * ModelDropZone — Drag-and-drop file upload with 3D STL preview
 *
 * Uses native HTML drag and drop + Three.js for STL viewing.
 * Shows live analysis summary after file is loaded.
 */

import { useState, useRef, useCallback, type DragEvent } from "react";
import dynamic from "next/dynamic";

const STLViewer = dynamic(() => import("./STLViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
      <p className="text-gray-400">Loading 3D viewer...</p>
    </div>
  ),
});

interface AnalysisSummary {
  boundingBoxMm?: { x: number; y: number; z: number };
  volumeCm3?: number;
  estimatedMaterialGrams?: number;
  estimatedPrintHours?: number;
  estimatedPriceAud?: number;
}

interface ModelDropZoneProps {
  onFileChange?: (file: File | null) => void;
  onAnalysis?: (summary: AnalysisSummary) => void;
  acceptedTypes?: string[];
  maxSizeMb?: number;
}

const ACCEPTED_EXTS = [".stl", ".3mf", ".obj", ".step", ".stp"];

export default function ModelDropZone({
  onFileChange,
  onAnalysis,
  maxSizeMb = 25,
}: ModelDropZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisSummary | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateFile(f: File): boolean {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) {
      setError(`Unsupported file type. Accepted: ${ACCEPTED_EXTS.join(", ")}`);
      return false;
    }
    if (f.size > maxSizeMb * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMb}MB.`);
      return false;
    }
    return true;
  }

  async function handleFile(f: File) {
    setError(null);
    if (!validateFile(f)) return;

    setFile(f);
    setAnalyzing(true);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    // Client-side STL analysis
    try {
      const buffer = await f.arrayBuffer();
      const summary = analyzeSTLBuffer(buffer);
      setAnalysis(summary);
      onAnalysis?.(summary);
    } catch {
      setAnalysis(null);
    }

    setAnalyzing(false);
    onFileChange?.(f);
  }

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  }, [previewUrl]);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setError(null);
    onFileChange?.(null);
  };

  const formatMm = (v: number) => Math.round(v * 10) / 10;

  if (file && previewUrl) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="h-72 sm:h-96 relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <STLViewer url={previewUrl} />
          <button
            onClick={clearFile}
            className="absolute top-3 right-3 z-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-1.5 text-sm font-medium shadow hover:bg-white dark:hover:bg-gray-800 transition"
            type="button"
          >
            ✕ Remove
          </button>
          <div className="absolute bottom-3 left-3 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full px-3 py-1 text-xs text-gray-500">
            Drag to rotate · Scroll to zoom
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">{file.name}</span>
          <span className="text-xs text-gray-500">
            ({(file.size / 1024 / 1024).toFixed(1)} MB)
          </span>
          {analyzing && (
            <span className="text-xs text-amber-500 animate-pulse">
              Analyzing...
            </span>
          )}
        </div>

        {analysis && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-primary/5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {analysis.boundingBoxMm && (
                <div>
                  <span className="text-xs text-gray-500">Dimensions</span>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatMm(analysis.boundingBoxMm.x)} ×{" "}
                    {formatMm(analysis.boundingBoxMm.y)} ×{" "}
                    {formatMm(analysis.boundingBoxMm.z)} mm
                  </div>
                </div>
              )}
              {analysis.volumeCm3 && (
                <div>
                  <span className="text-xs text-gray-500">Volume</span>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatMm(analysis.volumeCm3)} cm³
                  </div>
                </div>
              )}
              {analysis.estimatedMaterialGrams && (
                <div>
                  <span className="text-xs text-gray-500">Material</span>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    ~{Math.round(analysis.estimatedMaterialGrams)}g
                  </div>
                </div>
              )}
              {analysis.estimatedPriceAud && (
                <div>
                  <span className="text-xs text-gray-500">Est. Price</span>
                  <div className="font-semibold text-primary">
                    ${analysis.estimatedPriceAud.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_EXTS.join(",")}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <div className="text-5xl mb-4">
          {isDragOver ? "📥" : "📂"}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {isDragOver
            ? "Drop your file here"
            : "Drag and drop your model file"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          or click to browse · STL, 3MF, OBJ · up to {maxSizeMb}MB
        </p>
        <p className="text-xs text-gray-400">
          Preview your model in 3D and get an instant estimate.
        </p>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ─── Client-side STL analysis ───────────────────────────────────────

function analyzeSTLBuffer(buffer: ArrayBuffer): AnalysisSummary {
  const data = new Uint8Array(buffer);

  if (data.length >= 84) {
    try {
      const view = new DataView(buffer);
      const triangleCount = view.getUint32(80, true);
      const expectedSize = 84 + triangleCount * 50;
      if (data.length >= expectedSize && triangleCount > 0) {
        let minX = Infinity,
          minY = Infinity,
          minZ = Infinity;
        let maxX = -Infinity,
          maxY = -Infinity,
          maxZ = -Infinity;

        for (let i = 0; i < triangleCount; i++) {
          const offset = 84 + i * 50 + 12;
          for (let v = 0; v < 3; v++) {
            const vo = offset + v * 12;
            minX = Math.min(minX, view.getFloat32(vo, true));
            minY = Math.min(minY, view.getFloat32(vo + 4, true));
            minZ = Math.min(minZ, view.getFloat32(vo + 8, true));
            maxX = Math.max(maxX, view.getFloat32(vo, true));
            maxY = Math.max(maxY, view.getFloat32(vo + 4, true));
            maxZ = Math.max(maxZ, view.getFloat32(vo + 8, true));
          }
        }

        const dx = Math.max(0, maxX - minX);
        const dy = Math.max(0, maxY - minY);
        const dz = Math.max(0, maxZ - minZ);
        const volumeCm3 = (dx * dy * dz) / 1000;
        const materialGrams = volumeCm3 * 0.16;
        const printHours = Math.max(0.5, volumeCm3 / 45 + triangleCount / 9000);
        const priceAud = 8 + materialGrams * 0.2 + printHours * 5;

        return {
          boundingBoxMm: {
            x: Math.round(dx * 10) / 10,
            y: Math.round(dy * 10) / 10,
            z: Math.round(dz * 10) / 10,
          },
          volumeCm3: Math.round(volumeCm3 * 10) / 10,
          estimatedMaterialGrams: Math.round(materialGrams * 10) / 10,
          estimatedPrintHours: Math.round(printHours * 10) / 10,
          estimatedPriceAud: Math.round(priceAud * 100) / 100,
        };
      }
    } catch {
      // not binary STL format
    }
  }

  return {};
}
