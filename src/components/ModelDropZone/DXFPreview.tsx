"use client";

/**
 * DXFPreview — 2D canvas preview for DXF/SVG files
 *
 * For SVG: renders as an image directly.
 * For DXF: parses the file and draws linework on a canvas.
 */

import { useEffect, useRef, useState } from "react";

interface DXFPreviewProps {
  file: File;
  url: string;
}

export default function DXFPreview({ file, url }: DXFPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const isSvg = file.name.toLowerCase().endsWith(".svg");

  useEffect(() => {
    if (isSvg) return; // SVG renders as <img>

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    file
      .arrayBuffer()
      .then((buf) => {
        const text = new TextDecoder().decode(buf);

        // Simple DXF line extraction (ENTITY section)
        const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        // Match LINE entities in DXF
        const lineRegex =
          /LINE[\s\S]*?10\n(-?\d+\.?\d*)[\s\S]*?20\n(-?\d+\.?\d*)[\s\S]*?11\n(-?\d+\.?\d*)[\s\S]*?21\n(-?\d+\.?\d*)/g;
        let match;
        while ((match = lineRegex.exec(text)) !== null) {
          const x1 = parseFloat(match[1]);
          const y1 = parseFloat(match[2]);
          const x2 = parseFloat(match[3]);
          const y2 = parseFloat(match[4]);
          lines.push({ x1, y1, x2, y2 });
          minX = Math.min(minX, x1, x2);
          minY = Math.min(minY, y1, y2);
          maxX = Math.max(maxX, x1, x2);
          maxY = Math.max(maxY, y1, y2);
        }

        // Also match LWPolyline points
        const lwpRegex =
          /LWPOLYLINE[\s\S]*?90\n(\d+)([\s\S]*?)0\n/g;
        let lwMatch;
        while ((lwMatch = lwpRegex.exec(text)) !== null) {
          const count = parseInt(lwMatch[1]);
          const data = lwMatch[2];
          const pts: Array<{ x: number; y: number }> = [];
          const ptRegex = /10\n(-?\d+\.?\d*)\n20\n(-?\d+\.?\d*)/g;
          let pt;
          while ((pt = ptRegex.exec(data)) !== null) {
            pts.push({ x: parseFloat(pt[1]), y: parseFloat(pt[2]) });
          }

          for (let i = 1; i < pts.length; i++) {
            lines.push({
              x1: pts[i - 1].x,
              y1: pts[i - 1].y,
              x2: pts[i].x,
              y2: pts[i].y,
            });
            minX = Math.min(minX, pts[i].x);
            minY = Math.min(minY, pts[i].y);
            maxX = Math.max(maxX, pts[i].x);
            maxY = Math.max(maxY, pts[i].y);
          }
        }

        if (lines.length === 0) {
          setError("No linework found in this DXF file.");
          return;
        }

        const dw = maxX - minX || 1;
        const dh = maxY - minY || 1;
        setDims({ w: Math.round(dw * 10) / 10, h: Math.round(dh * 10) / 10 });

        // Fit to canvas
        const pad = 20;
        const scale = Math.min(
          (canvas.width - pad * 2) / dw,
          (canvas.height - pad * 2) / dh,
        );

        const cx = canvas.width / 2 - ((minX + maxX) / 2) * scale;
        const cy = canvas.height / 2 + ((minY + maxY) / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#1E9952";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";

        for (const line of lines) {
          ctx.beginPath();
          ctx.moveTo(cx + line.x1 * scale, cy - line.y1 * scale);
          ctx.lineTo(cx + line.x2 * scale, cy - line.y2 * scale);
          ctx.stroke();
        }
      })
      .catch(() => setError("Could not read this DXF file."));
  }, [file, isSvg]);

  if (isSvg) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 p-4">
        <img
          src={url}
          alt="SVG preview"
          className="max-w-full max-h-full object-contain"
          onError={() => setError("Could not render this SVG.")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      {error ? (
        <div className="text-center">
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">
            {error}
          </p>
          <p className="text-xs text-gray-400">
            The file was uploaded successfully but contains no extractable
            linework.
          </p>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="max-w-full max-h-full"
        />
      )}
      {dims && (
        <div className="mt-2 text-xs text-gray-500">
          {dims.w} × {dims.h} mm (approx)
        </div>
      )}
    </div>
  );
}
