/**
 * lib/groceries-storage.ts — Local JSON storage for parsed grocery orders.
 *
 * Each order is stored as a JSON file in data/groceries/orders/.
 * An index.json file tracks all orders for fast listing.
 */

import fs from "node:fs/promises";
import path from "node:path";

export interface GroceryItem {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: string;
}

export interface GroceryOrder {
  store_name: string;
  date: string;
  order_number: string;
  items: GroceryItem[];
  subtotal: number;
  total: number;
  importedAt: string;
}

function getStorageRoot(): string {
  return process.env.GROCERY_STORAGE_DIR || path.join(process.cwd(), "data", "groceries");
}

async function ensureRoot(): Promise<void> {
  await fs.mkdir(path.join(getStorageRoot(), "orders"), { recursive: true });
}

function indexPath(): string {
  return path.join(getStorageRoot(), "index.json");
}

function orderPath(orderNumber: string): string {
  return path.join(getStorageRoot(), "orders", `${orderNumber}.json`);
}

async function readIndex(): Promise<string[]> {
  await ensureRoot();
  try {
    const raw = await fs.readFile(indexPath(), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIndex(ids: string[]): Promise<void> {
  await ensureRoot();
  await fs.writeFile(indexPath(), JSON.stringify(ids, null, 2));
}

export async function orderExists(orderNumber: string): Promise<boolean> {
  try {
    await fs.access(orderPath(orderNumber));
    return true;
  } catch {
    return false;
  }
}

export async function saveOrder(order: GroceryOrder): Promise<void> {
  await ensureRoot();
  const filePath = orderPath(order.order_number);

  // Verify path is within storage root (path traversal protection)
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(getStorageRoot()))) {
    throw new Error("Security: path traversal detected");
  }

  await fs.writeFile(filePath, JSON.stringify(order, null, 2));

  // Update index
  const index = await readIndex();
  if (!index.includes(order.order_number)) {
    index.push(order.order_number);
    index.sort();
    await writeIndex(index);
  }
}

export async function listOrders(): Promise<{ order_number: string; date: string; store_name: string; total: number; item_count: number }[]> {
  const ids = await readIndex();
  const orders: { order_number: string; date: string; store_name: string; total: number; item_count: number }[] = [];

  for (const id of ids) {
    try {
      const raw = await fs.readFile(orderPath(id), "utf8");
      const order = JSON.parse(raw) as GroceryOrder;
      orders.push({
        order_number: order.order_number,
        date: order.date,
        store_name: order.store_name,
        total: order.total,
        item_count: order.items.length,
      });
    } catch {
      // Skip corrupted entries
    }
  }

  // Sort by date descending
  orders.sort((a, b) => b.date.localeCompare(a.date));
  return orders;
}

export async function getOrder(orderNumber: string): Promise<GroceryOrder | null> {
  try {
    const raw = await fs.readFile(orderPath(orderNumber), "utf8");
    return JSON.parse(raw) as GroceryOrder;
  } catch {
    return null;
  }
}

export async function deleteOrder(orderNumber: string): Promise<boolean> {
  try {
    await fs.unlink(orderPath(orderNumber));
    const index = await readIndex();
    const filtered = index.filter((id) => id !== orderNumber);
    if (filtered.length !== index.length) {
      await writeIndex(filtered);
    }
    return true;
  } catch {
    return false;
  }
}

export async function getSpendingSummary(): Promise<{
  total_spend: number;
  total_orders: number;
  by_store: Record<string, number>;
  by_category: Record<string, number>;
  by_month: Record<string, number>;
}> {
  const ids = await readIndex();
  let total_spend = 0;
  const by_store: Record<string, number> = {};
  const by_category: Record<string, number> = {};
  const by_month: Record<string, number> = {};

  for (const id of ids) {
    try {
      const raw = await fs.readFile(orderPath(id), "utf8");
      const order = JSON.parse(raw) as GroceryOrder;
      total_spend += order.total;

      by_store[order.store_name] = (by_store[order.store_name] || 0) + order.total;

      const month = order.date.slice(0, 7); // YYYY-MM
      by_month[month] = (by_month[month] || 0) + order.total;

      for (const item of order.items) {
        const cat = item.category || "Uncategorised";
        by_category[cat] = (by_category[cat] || 0) + item.total_price;
      }
    } catch {
      // skip
    }
  }

  return {
    total_spend: Math.round(total_spend * 100) / 100,
    total_orders: ids.length,
    by_store,
    by_category: Object.fromEntries(
      Object.entries(by_category)
        .sort(([, a], [, b]) => b - a)
        .map(([k, v]) => [k, Math.round(v * 100) / 100])
    ),
    by_month: Object.fromEntries(
      Object.entries(by_month).sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, Math.round(v * 100) / 100])
    ),
  };
}
