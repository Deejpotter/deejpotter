/**
 * lib/groceries-parser.ts — Shared Woolworths PDF parser
 *
 * Extracts text from text-based PDFs (Woolworths orders) and parses
 * the receipt format into structured data. Used by both the single-upload
 * API route and the batch import route.
 */

import { type GroceryItem } from "./groceries-storage";

/**
 * Parse a Woolworths order PDF buffer into structured items.
 * Handles the common Woolworths receipt format.
 */
export function parseWoolworthsText(text: string): {
  items: GroceryItem[];
  orderNumber?: string;
  date?: string;
  total?: number;
} {
  const items: GroceryItem[] = [];
  let orderNumber: string | undefined;
  let date: string | undefined;
  let total: number | undefined;
  let currentCategory = "Uncategorised";

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Order number — multiple formats Woolworths uses
    const orderMatch = line.match(/order\s*(?:number|no|#)[:\s.]*(\d+)/i);
    if (orderMatch) { orderNumber = orderMatch[1]!; continue; }

    // ISO date (YYYY-MM-DD) — most reliable
    const isoDateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoDateMatch && !date) { date = isoDateMatch[1]!; continue; }

    // Spelled date (e.g., "25 November 2025")
    const dateMatch = line.match(/(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i);
    if (dateMatch && !date) {
      const d = new Date(dateMatch[1]!);
      if (!isNaN(d.getTime())) { date = d.toISOString().split("T")[0]!; continue; }
    }

    // Total line
    const totalMatch = line.match(/total\s*(?:due|paid)?[:\s]*\$?(\d+\.?\d*)/i);
    if (totalMatch && !total) { total = parseFloat(totalMatch[1]!); continue; }

    // Category header (capitalised, standalone)
    const categoryMatch = line.match(/^([A-Z][A-Za-z &]+)$/);
    if (categoryMatch && !line.includes("$") && !line.includes("Qty")) {
      currentCategory = categoryMatch[1]!.trim();
      continue;
    }

    // Item: "Item Name qty x $price $total"
    const itemMatch = line.match(/^(.+?)\s+(\d+)\s*x\s*\$?(\d+\.?\d*)\s*\$?(\d+\.?\d*)$/);
    if (itemMatch) {
      items.push({
        name: itemMatch[1]!.trim(),
        quantity: parseInt(itemMatch[2]!, 10),
        unit_price: parseFloat(itemMatch[3]!),
        total_price: parseFloat(itemMatch[4]!),
        category: currentCategory,
      });
      continue;
    }

    // Item: "Category Total: $xx.xx" — skip, it's a section summary
    const sectionTotalMatch = line.match(/^[A-Z][A-Za-z &,/]+\s*\$?\d+\.?\d*$/);
    if (sectionTotalMatch && line.match(/\$\d+/)) continue;

    // Item: standalone "$xx.xx" lines that look like prices
    const priceOnlyMatch = line.match(/^\$?(\d+\.\d{2})$/);
    if (priceOnlyMatch) continue;
  }

  return { items, orderNumber, date, total };
}

/**
 * Extract readable text from a text-based PDF buffer.
 * Handles Tj and TJ PDF operators that Woolworths uses.
 */
export function extractPdfText(buffer: Buffer): string {
  const raw = buffer.toString("utf-8");
  const textParts: string[] = [];

  // Track seen segments to avoid duplicates
  const seen = new Set<string>();

  // Extract text from (text) Tj
  const tjMatches = raw.match(/\(([^)]*)\)\s*Tj/g);
  if (tjMatches) {
    for (const m of tjMatches) {
      const inner = m.replace(/^\(/, "").replace(/\)\s*Tj$/, "");
      if (inner.trim() && !seen.has(inner)) {
        textParts.push(decodePdfString(inner));
        seen.add(inner);
      }
    }
  }

  // Extract text from [(text)] TJ arrays
  const tjArrayMatches = raw.match(/\[([^\]]*)\]\s*TJ/g);
  if (tjArrayMatches) {
    for (const m of tjArrayMatches) {
      const inner = m.replace(/^\[/, "").replace(/\]\s*TJ$/, "");
      const segments = inner.match(/\(([^)]*)\)/g);
      if (segments) {
        const joined = segments.map((s) => s.replace(/^\(/, "").replace(/\)$/, "")).join("");
        if (joined.trim() && !seen.has(joined)) {
          textParts.push(decodePdfString(joined));
          seen.add(joined);
        }
      }
    }
  }

  return textParts.join("\n");
}

/**
 * Decode PDF escape sequences and special characters.
 */
function decodePdfString(str: string): string {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\(.)/g, "$1");
}
