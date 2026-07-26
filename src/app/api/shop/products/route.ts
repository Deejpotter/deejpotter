/**
 * /api/shop/products — Product catalog API
 * Lists products from MongoDB (populated via admin) + Gelato catalog
 */

import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { COLLECTIONS, productSchema, type Product } from "@/lib/shop-schemas";
import { z } from "zod";

const querySchema = z.object({
  type: z.enum(["digital", "service"]).optional(),
  published: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = querySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!query.success) {
      return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }

    const { type, published, limit, offset } = query.data;
    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (published !== undefined) filter.published = published;

    const collection = await getCollection(COLLECTIONS.PRODUCTS);
    const total = await collection.countDocuments(filter);
    const docs = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    const products: Product[] = docs.map((doc) => ({
      _id: doc._id.toString(),
      name: doc.name || "",
      slug: doc.slug || "",
      description: doc.description || "",
      price: doc.price || 0,
      compareAtPrice: doc.compareAtPrice ?? null,
      type: doc.type || "digital",
      images: doc.images || [],
      tags: doc.tags || [],
      published: doc.published ?? false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json({ products, total, limit, offset });
  } catch (error) {
    console.error("Shop products error:", error);
    return NextResponse.json({ error: "Could not load products." }, { status: 500 });
  }
}
