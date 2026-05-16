/**
 * shop-schemas.ts — MongoDB schemas and Zod validation for e-commerce
 */

import { z } from "zod";

// ── Product Types ──

export type ProductType = "pod" | "digital" | "service";

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().max(5000).default(""),
  price: z.number().nonnegative(), // in AUD cents (or 0 for quote-based services)
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  type: z.enum(["pod", "digital", "service"] as const),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  // Gelato POD-specific
  gelatoProductId: z.string().optional(),
  gelatoVariantId: z.string().optional(),

  // Digital product
  downloadUrl: z.string().optional(),

  // Service
  serviceConfig: z
    .object({
      requiresQuote: z.boolean().default(false),
      deliveryDays: z.number().optional(),
    })
    .optional(),

  published: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Product = z.infer<typeof productSchema> & { _id: string };

// ── Cart Types ──

export const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1).max(100),
  type: z.enum(["pod", "digital", "service"]),
  image: z.string().optional(),
  // Gelato order details
  gelatoProductId: z.string().optional(),
  fileUrl: z.string().optional(), // for POD upload
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string(),
  items: z.array(cartItemSchema),
  updatedAt: z.string().optional(),
});

// ── Order Types ──

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "fulfilled"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export const orderSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email(),
  items: z.array(cartItemSchema),
  total: z.number(), // AUD cents
  status: z.enum([
    "pending_payment",
    "paid",
    "processing",
    "fulfilled",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ] as const),
  shippingAddress: z
    .object({
      name: z.string(),
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    })
    .optional(),
  stripePaymentIntentId: z.string().optional(),
  gelatoOrderId: z.string().optional(), // reference for POD orders
  trackingUrl: z.string().optional(),
  notes: z.string().max(3000).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Order = z.infer<typeof orderSchema> & { _id: string };

// ── Create Payment Intent ──

export const createPaymentIntentSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().int().min(1),
      type: z.enum(["pod", "digital", "service"]),
    })
  ).min(1, "Cart must have at least one item"),
  email: z.string().email().optional(),
});

// ── MongoDB collection names ──

export const COLLECTIONS = {
  PRODUCTS: "shop_products",
  ORDERS: "shop_orders",
  CARTS: "shop_carts",
} as const;
