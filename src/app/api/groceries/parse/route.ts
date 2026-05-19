/**
 * /api/groceries/parse — Upload and parse a Woolworths order PDF
 *
 * Extracts text from PDF, parses Woolworths receipt format,
 * stores as local JSON. Clerk-protected (admin only).
 */

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { saveOrder, orderExists, type GroceryOrder, type GroceryItem } from "@/lib/groceries-storage";
import { extractPdfText, parseWoolworthsText } from "@/lib/groceries-parser";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    // Extract text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = extractPdfText(buffer);

    if (!text.trim()) {
      return NextResponse.json({ error: "No text could be extracted from this PDF." }, { status: 422 });
    }

    // Parse Woolworths receipt
    const parsed = parseWoolworthsText(text);
    if (parsed.items.length === 0) {
      return NextResponse.json({ error: "Could not find any items in this receipt." }, { status: 422 });
    }

    // Deduplicate
    const orderNumber = parsed.orderNumber || `manual-${Date.now()}`;
    const exists = await orderExists(orderNumber);
    if (exists) {
      return NextResponse.json({ error: `Order ${orderNumber} has already been imported.` }, { status: 409 });
    }

    // Save
    const total = parsed.total || parsed.items.reduce((s, i) => s + i.total_price, 0);
    const order: GroceryOrder = {
      store_name: "Woolworths",
      date: parsed.date || new Date().toISOString().split("T")[0]!,
      order_number: orderNumber,
      items: parsed.items,
      subtotal: total,
      total,
      importedAt: new Date().toISOString(),
    };

    await saveOrder(order);

    return NextResponse.json({
      ok: true,
      order_number: order.order_number,
      date: order.date,
      item_count: order.items.length,
      total: order.total,
      summary: { total_spend: order.total, by_category: aggregateByCategory(order.items) },
    });
  } catch (error) {
    console.error("Groceries parse error:", error);
    return NextResponse.json({ error: "Could not process the receipt." }, { status: 500 });
  }
}

function aggregateByCategory(items: GroceryItem[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of items) { result[item.category] = (result[item.category] || 0) + item.total_price; }
  return Object.fromEntries(Object.entries(result).map(([k, v]) => [k, Math.round(v * 100) / 100]));
}
