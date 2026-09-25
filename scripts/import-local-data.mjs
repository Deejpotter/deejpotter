/**
 * scripts/import-local-data.mjs — One-off import of contact leads and grocery
 * orders that were saved as JSON files before they moved to MongoDB.
 *
 * Reads:
 *   data/contact-leads/index.json      -> "contact_leads" collection
 *   data/groceries/orders/*.json       -> "grocery_orders" collection
 * (override with CONTACT_LEADS_DIR / GROCERY_STORAGE_DIR)
 *
 * Safe to run more than once: leads are matched on `id` and orders on
 * `order_number`, so existing records are replaced rather than duplicated.
 *
 * Usage: MONGODB_URI=... DB_NAME=deejpotter node scripts/import-local-data.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI (and DB_NAME if it isn't 'deejpotter').");
  process.exit(1);
}
const dbName = process.env.DB_NAME || "deejpotter";

const leadsDir = process.env.CONTACT_LEADS_DIR || path.join(process.cwd(), "data", "contact-leads");
const groceriesDir = process.env.GROCERY_STORAGE_DIR || path.join(process.cwd(), "data", "groceries");

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);

  // Contact leads: one index.json holding every lead.
  const leads = (await readJson(path.join(leadsDir, "index.json"))) ?? [];
  let leadCount = 0;
  for (const lead of Array.isArray(leads) ? leads : []) {
    if (!lead?.id) continue;
    await db.collection("contact_leads").replaceOne({ id: lead.id }, lead, { upsert: true });
    leadCount++;
  }
  console.log(`Imported ${leadCount} contact lead(s) from ${leadsDir}`);

  // Grocery orders: one JSON file per order.
  let orderFiles = [];
  try {
    orderFiles = (await fs.readdir(path.join(groceriesDir, "orders"))).filter((f) => f.endsWith(".json"));
  } catch {
    // No local groceries folder.
  }
  let orderCount = 0;
  for (const file of orderFiles) {
    const order = await readJson(path.join(groceriesDir, "orders", file));
    if (!order?.order_number) continue;
    await db.collection("grocery_orders").replaceOne({ order_number: order.order_number }, order, { upsert: true });
    orderCount++;
  }
  console.log(`Imported ${orderCount} grocery order(s) from ${groceriesDir}`);
} finally {
  await client.close();
}
