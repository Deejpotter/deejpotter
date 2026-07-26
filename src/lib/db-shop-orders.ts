import { ObjectId } from "mongodb";
import { getCollection } from "./db";
import {
  COLLECTIONS,
  orderSchema,
  type Order,
  type OrderStatus,
  type CartItem,
} from "./shop-schemas";
import { z } from "zod";

function toOrder(doc: Record<string, unknown>): Order {
  return orderSchema
    .extend({ _id: z.string() })
    .parse({ ...doc, _id: String(doc._id) });
}

export async function createOrder(input: {
  email: string;
  items: CartItem[];
  total: number;
  userId?: string;
  stripePaymentIntentId?: string;
}) {
  const col = await getCollection(COLLECTIONS.ORDERS);
  const now = new Date().toISOString();

  const doc = orderSchema.parse({
    email: input.email,
    items: input.items,
    total: input.total,
    userId: input.userId,
    status: "pending_payment",
    stripePaymentIntentId: input.stripePaymentIntentId,
    createdAt: now,
    updatedAt: now,
  });

  const result = await col.insertOne(doc);
  return toOrder({ ...doc, _id: result.insertedId });
}

export async function listOrders(filters?: {
  status?: OrderStatus;
  email?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}) {
  const col = await getCollection(COLLECTIONS.ORDERS);
  const query: Record<string, unknown> = {};

  if (filters?.status) query.status = filters.status;
  if (filters?.email) query.email = filters.email.toLowerCase().trim();
  if (filters?.userId) query.userId = filters.userId;

  const docs = await col
    .find(query)
    .sort({ createdAt: -1 })
    .skip(filters?.offset || 0)
    .limit(filters?.limit || 100)
    .toArray();

  return docs.map((d) => toOrder(d as Record<string, unknown>));
}

export async function getOrderById(id: string) {
  const col = await getCollection(COLLECTIONS.ORDERS);
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? toOrder(doc as Record<string, unknown>) : null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  patch?: { stripePaymentIntentId?: string; notes?: string; email?: string },
) {
  const col = await getCollection(COLLECTIONS.ORDERS);
  const now = new Date().toISOString();

  const update: Record<string, unknown> = { status, updatedAt: now };
  if (patch?.stripePaymentIntentId) {
    update.stripePaymentIntentId = patch.stripePaymentIntentId;
  }
  if (patch?.notes !== undefined) {
    update.notes = patch.notes;
  }
  if (patch?.email) {
    update.email = patch.email.toLowerCase().trim();
  }

  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: "after" },
  );

  return result ? toOrder(result as Record<string, unknown>) : null;
}

export async function attachPaymentIntent(
  orderId: string,
  stripePaymentIntentId: string,
) {
  const col = await getCollection(COLLECTIONS.ORDERS);
  const now = new Date().toISOString();
  await col.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { stripePaymentIntentId, updatedAt: now } },
  );
}
