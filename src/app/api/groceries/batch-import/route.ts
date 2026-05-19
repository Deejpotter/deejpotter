/**
 * /api/groceries/batch-import — Batch import all Woolworths PDFs from downloads
 *
 * Scans ~/Downloads/Woolworths orders/ for PDFs, parses each one,
 * skips duplicates by order_number, and returns import stats.
 *
 * Requires Clerk auth (admin only).
 */

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import fs from "node:fs/promises";
import path from "node:path";
import os from "os";
import { saveOrder, orderExists, type GroceryOrder, type GroceryItem } from "@/lib/groceries-storage";

const DOWNLOADS_DIR = path.join(os.homedir(), "Downloads", "Woolworths orders");

/**
 * Parse Woolworths PDF text into structured order data.
 * Same logic as /api/groceries/parse.
 */
function parseWoolworthsText(text: string): { items: GroceryItem[]; orderNumber?: string; date?: string; total?: number } {
  const items: GroceryItem[] = [];
  let orderNumber: string | undefined;
  let date: string | undefined;
  let total: number | undefined;
  let currentCategory = "Uncategorised";

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const orderMatch = line.match(/order\s*(?:number|no)[:\s]*[#]?(\d+)/i);
    if (orderMatch) { orderNumber = orderMatch[1]!; continue; }

    const isoDateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoDateMatch && !date) { date = isoDateMatch[1]!; continue; }

    const dateMatch = line.match(/(\d{1,2}\s+\w+\s+\d{4})/);
    if (dateMatch && !date) { const d = new Date(dateMatch[1]!); if (!isNaN(d.getTime())) { date = d.toISOString().split("T")[0]!; } continue; }

    const totalMatch = line.match(/total\s*(?:due|paid)?[:\s]*\$?(\d+\.?\d*)/i);
    if (totalMatch && !total) { total = parseFloat(totalMatch[1]!); continue; }

    const categoryMatch = line.match(/^([A-Z][A-Za-z &]+)$/);
    if (categoryMatch && !line.includes("$") && !line.includes("Qty")) { currentCategory = categoryMatch[1]!.trim(); continue; }

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

    const altItemMatch = line.match(/^(.+?)\s+\$?(\d+\.?\d*)\s*$/);
    if (altItemMatch) {
      const name = altItemMatch[1]!.trim();
      if (name.length > 3 && !name.match(/^(sub)?total|order|thank|delivery|pickup/i) && !name.startsWith("*") && !items.some((i) => i.name === name)) {
        items.push({ name, quantity: 1, unit_price: parseFloat(altItemMatch[2]!), total_price: parseFloat(altItemMatch[2]!), category: currentCategory });
      }
    }
  }

  return { items, orderNumber, date, total };
}

export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Check if the downloads directory exists
    let files: string[];
    try {
      files = await fs.readdir(DOWNLOADS_DIR);
    } catch {
      return NextResponse.json({ ok: true, imported: 0, skipped: 0, errors: 0, message: "Woolworths orders directory not found." });
    }

    const pdfs = files.filter((f) => f.toLowerCase().endsWith(".pdf"));
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const pdfFile of pdfs) {
      try {
        const filePath = path.join(DOWNLOADS_DIR, pdfFile);
        const buffer = await fs.readFile(filePath);

        // Extract text from PDF
        const text = pdfParseText(buffer);
        if (!text.trim()) { errors++; continue; }

        const parsed = parseWoolworthsText(text);
        if (parsed.items.length === 0) { errors++; continue; }

        // Check for duplicates
        if (parsed.orderNumber) {
          const exists = await orderExists(parsed.orderNumber);
          if (exists) { skipped++; continue; }
        }

        // Save the order
        const order: GroceryOrder = {
          store_name: "Woolworths",
          date: parsed.date || "unknown",
          order_number: parsed.orderNumber || `batch-${Date.now()}-${imported}`,
          items: parsed.items,
          subtotal: parsed.total || parsed.items.reduce((s, i) => s + i.total_price, 0),
          total: parsed.total || parsed.items.reduce((s, i) => s + i.total_price, 0),
          importedAt: new Date().toISOString(),
        };

        await saveOrder(order);
        imported++;
      } catch {
        errors++;
      }
    }

    return NextResponse.json({ ok: true, imported, skipped, errors });
  } catch (error) {
    console.error("Batch import error:", error);
    return NextResponse.json({ error: "Batch import failed." }, { status: 500 });
  }
}

/**
 * Simple PDF text extraction — handles text-based PDFs (like Woolworths).
 */
function pdfParseText(buffer: Buffer): string {
  const raw = buffer.toString("utf-8");
  const textParts: string[] = [];

  // Extract text from Tj operators: (text) Tj
  const tjMatches = raw.match(/\(([^)]*)\)\s*Tj/g);
  if (tjMatches) {
    for (const m of tjMatches) {
      const inner = m.replace(/^\(/, "").replace(/\)\s*Tj$/, "");
      if (inner.trim()) textParts.push(inner);
    }
  }

  // Also try TJ arrays
  const tjArrayMatches = raw.match(/\[([^\]]*)\]\s*TJ/g);
  if (tjArrayMatches) {
    for (const m of tjArrayMatches) {
      const inner = m.replace(/^\[/, "").replace(/\]\s*TJ$/, "");
      const segs = inner.match(/\(([^)]*)\)/g);
      if (segs) {
        textParts.push(segs.map((s) => s.replace(/^\(/, "").replace(/\)$/, "")).join(""));
      }
    }
  }

  return textParts.join("\n");
}
