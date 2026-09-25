/**
 * lib/groceries-storage.ts — Parsed grocery orders, stored in MongoDB.
 *
 * Orders used to be JSON files on disk, which Render wipes on every deploy.
 * They now live in the "grocery_orders" collection, one document per order,
 * keyed by order_number (unique index in db.ts ensureIndexes).
 */

import { getCollection } from "./db";

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

const COLLECTION = "grocery_orders";
const DUPLICATE_KEY = 11000;

// Leave Mongo's internal _id out of everything we return.
const withoutMongoId = { projection: { _id: 0 } } as const;

function ordersCollection() {
  return getCollection<GroceryOrder>(COLLECTION);
}

export async function orderExists(orderNumber: string): Promise<boolean> {
  const orders = await ordersCollection();
  return (await orders.countDocuments({ order_number: orderNumber }, { limit: 1 })) > 0;
}

export async function saveOrder(order: GroceryOrder): Promise<void> {
  const orders = await ordersCollection();
  // Re-importing the same order replaces it rather than duplicating it.
  // The unique index on order_number stops two concurrent imports from both
  // inserting; the one that loses gets a duplicate key error, and retrying
  // turns it into a plain replace of the order the other one just inserted.
  try {
    await orders.replaceOne({ order_number: order.order_number }, { ...order }, { upsert: true });
  } catch (err) {
    if ((err as { code?: number }).code !== DUPLICATE_KEY) throw err;
    await orders.replaceOne({ order_number: order.order_number }, { ...order });
  }
}

export async function listOrders(): Promise<{ order_number: string; date: string; store_name: string; total: number; item_count: number }[]> {
  const orders = await ordersCollection();
  const docs = await orders
    .find({}, { projection: { _id: 0, order_number: 1, date: 1, store_name: 1, total: 1, items: 1 } })
    .sort({ date: -1 })
    .toArray();

  return docs.map((order) => ({
    order_number: order.order_number,
    date: order.date,
    store_name: order.store_name,
    total: order.total,
    item_count: order.items?.length ?? 0,
  }));
}

export async function getOrder(orderNumber: string): Promise<GroceryOrder | null> {
  const orders = await ordersCollection();
  return orders.findOne({ order_number: orderNumber }, withoutMongoId);
}

export async function deleteOrder(orderNumber: string): Promise<boolean> {
  const orders = await ordersCollection();
  const result = await orders.deleteOne({ order_number: orderNumber });
  return result.deletedCount > 0;
}

export async function getSpendingSummary(): Promise<{
  total_spend: number;
  total_orders: number;
  by_store: Record<string, number>;
  by_category: Record<string, number>;
  by_month: Record<string, number>;
}> {
  const orders = await ordersCollection();
  // A personal grocery history is small, so summing in JS is simpler than
  // an aggregation pipeline and keeps the rounding rules in one place.
  const all = await orders.find({}, withoutMongoId).toArray();

  let total_spend = 0;
  const by_store: Record<string, number> = {};
  const by_category: Record<string, number> = {};
  const by_month: Record<string, number> = {};

  for (const order of all) {
    total_spend += order.total;

    by_store[order.store_name] = (by_store[order.store_name] || 0) + order.total;

    const month = order.date.slice(0, 7); // YYYY-MM
    by_month[month] = (by_month[month] || 0) + order.total;

    for (const item of order.items ?? []) {
      const cat = item.category || "Uncategorised";
      by_category[cat] = (by_category[cat] || 0) + item.total_price;
    }
  }

  return {
    total_spend: Math.round(total_spend * 100) / 100,
    total_orders: all.length,
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
