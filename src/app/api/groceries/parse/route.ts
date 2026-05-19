/**
 * /api/groceries/parse — Upload and parse a Woolworths order PDF
 *
 * Uses pdf-parse-new to extract text from the PDF, then parses the
 * Woolworths-specific format to produce structured order data.
 *
 * Requires Clerk auth (admin only).
 */

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { saveOrder, orderExists, type GroceryOrder, type GroceryItem } from "@/lib/groceries-storage";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Parse Woolworths receipt text into structured items.
 * Handles the specific format Woolworths uses in their order PDFs.
 */
function parseWoolworthsText(text: string): { items: GroceryItem[]; orderNumber?: string; date?: string; total?: number } {
  const items: GroceryItem[] = [];
  let orderNumber: string | undefined;
  let date: string | undefined;
  let total: number | undefined;
  let currentCategory = "Uncategorised";

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Order number
    const orderMatch = line.match(/order\s*(?:number|no)[:\s]*[#]?(\d+)/i);
    if (orderMatch) {
      orderNumber = orderMatch[1]!;
      continue;
    }

    // Date
    const dateMatch = line.match(/(\d{1,2}\s+\w+\s+\d{4})/);
    if (dateMatch && !date) {
      const parsed = new Date(dateMatch[1]!);
      if (!isNaN(parsed.getTime())) {
        date = parsed.toISOString().split("T")[0]!;
      }
      continue;
    }

    // Date in ISO-like format
    const isoDateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoDateMatch && !date) {
      date = isoDateMatch[1]!;
      continue;
    }

    // Total
    const totalMatch = line.match(/total\s*(?:due|paid)?[:\s]*\$?(\d+\.?\d*)/i);
    if (totalMatch && !total) {
      total = parseFloat(totalMatch[1]!);
      continue;
    }

    // Category header (e.g., "Bakery", "Dairy", "Fruit & Vegetables")
    const categoryMatch = line.match(/^([A-Z][A-Za-z &]+)$/);
    if (categoryMatch && !line.includes("$") && !line.includes("Qty")) {
      currentCategory = categoryMatch[1]!.trim();
      continue;
    }

    // Item line — Woolworths format varies but typically:
    // "Item Name qty x $price $total" or "Item Name $price each"
    const itemMatch = line.match(/^(.+?)\s+(\d+)\s*x\s*\$?(\d+\.?\d*)\s*\$?(\d+\.?\d*)$/);
    if (itemMatch) {
      const name = itemMatch[1]!.trim();
      const quantity = parseInt(itemMatch[2]!, 10);
      const unitPrice = parseFloat(itemMatch[3]!);
      const totalPrice = parseFloat(itemMatch[4]!);
      items.push({ name, quantity, unit_price: unitPrice, total_price: totalPrice, category: currentCategory });
      continue;
    }

    // Alternate format: "Item Name $price each" with quantity elsewhere
    const altItemMatch = line.match(/^(.+?)\s+\$?(\d+\.?\d*)\s*$/);
    if (altItemMatch) {
      const name = altItemMatch[1]!.trim();
      // Skip if it looks like a section total or meta line
      if (name.length > 3 && !name.match(/^(sub)?total|order|thank|delivery|pickup/i) && !name.startsWith("*")) {
        // Check if this item was already parsed — Woolworths sometimes duplicates
        if (!items.some((i) => i.name === name)) {
          items.push({ name, quantity: 1, unit_price: parseFloat(altItemMatch[2]!), total_price: parseFloat(altItemMatch[2]!), category: currentCategory });
        }
      }
    }
  }

  return { items, orderNumber, date, total };
}

export async function POST(request: Request) {
  // Auth check
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "PDF file is required." }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File too large. Max 10 MB." }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
    }

    // Extract text from PDF using simple text PDF extraction
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Woolworths PDFs are text-based, not scanned images
    let text: string;
    const rawText = buffer.toString("utf-8");

    // Extract text between parentheses in PDF content streams
    // PDF operators like Tj and TJ wrap text in parentheses
    const textParts: string[] = [];
    const parenMatches = rawText.match(/\(([^)]*)\)\s*Tj/g);
    if (parenMatches) {
      for (const m of parenMatches) {
        const inner = m.replace(/\(/, "").replace(/\)\s*Tj/, "");
        if (inner.trim()) textParts.push(inner);
      }
    }

    // Also try TJ arrays (multiple text segments)
    const tjMatch = rawText.match(/\[([^\]]*)\]\s*TJ/g);
    if (tjMatch) {
      for (const m of tjMatch) {
        const inner = m.replace(/^\[/, "").replace(/\]\s*TJ$/, "");
        const segments = inner.match(/\(([^)]*)\)/g);
        if (segments) {
          textParts.push(segments.map((s) => s.replace(/\(/g, "").replace(/\)/g, "")).join(""));
        }
      }
    }

    text = textParts.join("\n");

    if (!text.trim()) {
      // Absolute last resort: try to find readable text in the raw PDF
      const clean = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, " ");
      const lines = clean.split(/\r?\n/).filter((l) => l.trim() && !l.match(/^%/));
      text = lines.join("\n");
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "No text could be extracted from this PDF." }, { status: 422 });
    }

    // Parse Woolworths-specific format
    const parsed = parseWoolworthsText(text);

    if (parsed.items.length === 0) {
      return NextResponse.json({ error: "Could not find any items in this receipt." }, { status: 422 });
    }

    // Check for duplicates
    if (parsed.orderNumber) {
      const exists = await orderExists(parsed.orderNumber);
      if (exists) {
        return NextResponse.json({ error: `Order ${parsed.orderNumber} has already been imported.` }, { status: 409 });
      }
    }

    // Build and save the order
    const order: GroceryOrder = {
      store_name: "Woolworths",
      date: parsed.date || new Date().toISOString().split("T")[0]!,
      order_number: parsed.orderNumber || `manual-${Date.now()}`,
      items: parsed.items,
      subtotal: parsed.total || parsed.items.reduce((sum, i) => sum + i.total_price, 0),
      total: parsed.total || parsed.items.reduce((sum, i) => sum + i.total_price, 0),
      importedAt: new Date().toISOString(),
    };

    await saveOrder(order);

    return NextResponse.json({
      ok: true,
      order_number: order.order_number,
      date: order.date,
      item_count: order.items.length,
      total: order.total,
      summary: {
        total_spend: order.total,
        by_category: aggregateByCategory(order.items),
      },
    });
  } catch (error) {
    console.error("Groceries parse error:", error);
    return NextResponse.json({ error: "Could not process the receipt." }, { status: 500 });
  }
}

function aggregateByCategory(items: GroceryItem[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of items) {
    result[item.category] = (result[item.category] || 0) + item.total_price;
  }
  return Object.fromEntries(
    Object.entries(result).map(([k, v]) => [k, Math.round(v * 100) / 100])
  );
}
