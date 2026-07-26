import { ObjectId } from "mongodb";
import { getCollection } from "./db";
import { COLLECTIONS, productSchema, type Product } from "./shop-schemas";
import { z } from "zod";

const productPatchSchema = productSchema.partial();

function toProduct(doc: Record<string, unknown>): Product {
  return productSchema
    .extend({ _id: z.string() })
    .parse({ ...doc, _id: String(doc._id) });
}

export async function listProducts(filters?: {
  type?: "digital" | "service";
  published?: boolean;
  limit?: number;
  offset?: number;
}) {
  const col = await getCollection(COLLECTIONS.PRODUCTS);
  const query: Record<string, unknown> = {};

  if (filters?.type) query.type = filters.type;
  if (filters?.published !== undefined) query.published = filters.published;

  const docs = await col
    .find(query)
    .sort({ createdAt: -1 })
    .skip(filters?.offset || 0)
    .limit(filters?.limit || 100)
    .toArray();

  return docs.map((d) => toProduct(d as Record<string, unknown>));
}

export async function getProductBySlug(slug: string) {
  const col = await getCollection(COLLECTIONS.PRODUCTS);
  const doc = await col.findOne({ slug });
  return doc ? toProduct(doc as Record<string, unknown>) : null;
}

export async function upsertProduct(input: z.input<typeof productSchema>) {
  const col = await getCollection(COLLECTIONS.PRODUCTS);
  const now = new Date().toISOString();

  const parsed = productSchema.parse({
    ...input,
    slug: input.slug.trim(),
    name: input.name.trim(),
    createdAt: input.createdAt || now,
    updatedAt: now,
  });

  const { createdAt, ...rest } = parsed;

  await col.updateOne(
    { slug: parsed.slug },
    {
      $set: rest,
      $setOnInsert: { createdAt },
    },
    { upsert: true },
  );

  const updated = await col.findOne({ slug: parsed.slug });
  if (!updated) throw new Error("Failed to upsert product");
  return toProduct(updated as Record<string, unknown>);
}

export async function patchProductById(
  id: string,
  patch: z.input<typeof productPatchSchema>,
) {
  const col = await getCollection(COLLECTIONS.PRODUCTS);
  const existing = await col.findOne({ _id: new ObjectId(id) });
  if (!existing) return null;

  const now = new Date().toISOString();
  const parsedPatch = productPatchSchema.parse(patch);

  const merged = productSchema.parse({
    ...(existing as Record<string, unknown>),
    ...parsedPatch,
    _id: undefined,
    createdAt: (existing as any).createdAt,
    updatedAt: now,
  });

  const { createdAt, ...rest } = merged;

  await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: rest, $setOnInsert: { createdAt } },
  );

  const updated = await col.findOne({ _id: new ObjectId(id) });
  return updated ? toProduct(updated as Record<string, unknown>) : null;
}

export async function deleteProductById(id: string) {
  const col = await getCollection(COLLECTIONS.PRODUCTS);
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

