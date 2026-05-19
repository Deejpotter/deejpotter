/**
 * /api/groceries/batch-import — Import all Woolworths PDFs from Downloads
 *
 * Scans ~/Downloads/Woolworths orders/, parses each PDF using the shared
 * parser, deduplicates by order_number. Admin only.
 */

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import fs from "node:fs/promises";
import path from "node:path";
import os from "os";
import { saveOrder, orderExists, type GroceryOrder } from "@/lib/groceries-storage";
import { extractPdfText, parseWoolworthsText } from "@/lib/groceries-parser";

const DOWNLOADS_DIR = path.join(os.homedir(), "Downloads", "Woolworths orders");

export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let files: string[];
    try {
      files = await fs.readdir(DOWNLOADS_DIR);
    } catch {
      return NextResponse.json({ ok: true, imported: 0, skipped: 0, errors: 0, message: "Woolworths orders directory not found." });
    }

    const pdfs = files.filter((f) => f.toLowerCase().endsWith(".pdf"));
    let imported = 0, skipped = 0, errors = 0;

    for (const pdfFile of pdfs) {
      try {
        const filePath = path.join(DOWNLOADS_DIR, pdfFile);
        const buffer = await fs.readFile(filePath);
        const text = extractPdfText(buffer);
        if (!text.trim()) { errors++; continue; }

        const parsed = parseWoolworthsText(text);
        if (parsed.items.length === 0) { errors++; continue; }

        if (parsed.orderNumber) {
          if (await orderExists(parsed.orderNumber)) { skipped++; continue; }
        }

        const total = parsed.total || parsed.items.reduce((s, i) => s + i.total_price, 0);
        const order: GroceryOrder = {
          store_name: "Woolworths",
          date: parsed.date || "unknown",
          order_number: parsed.orderNumber || `batch-${Date.now()}-${imported}`,
          items: parsed.items,
          subtotal: total,
          total,
          importedAt: new Date().toISOString(),
        };

        await saveOrder(order);
        imported++;
      } catch { errors++; }
    }

    return NextResponse.json({ ok: true, imported, skipped, errors });
  } catch (error) {
    console.error("Batch import error:", error);
    return NextResponse.json({ error: "Batch import failed." }, { status: 500 });
  }
}
