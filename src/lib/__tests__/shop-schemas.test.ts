import { describe, it, expect } from "vitest";
import { productSchema, orderSchema, createPaymentIntentSchema, cartItemSchema } from "@/lib/shop-schemas";

describe("shop-schemas", () => {
  describe("productSchema", () => {
    it("accepts valid product", () => {
      const result = productSchema.safeParse({
        name: "Test Product",
        slug: "test-product",
        price: 2999,
        type: "digital",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing name", () => {
      const result = productSchema.safeParse({
        slug: "test",
        price: 1000,
        type: "digital",
      });
      expect(result.success).toBe(false);
    });

    it("accepts POD products with gelato IDs", () => {
      const result = productSchema.safeParse({
        name: "T-Shirt",
        slug: "t-shirt",
        price: 2500,
        type: "pod",
        gelatoProductId: "gel_123",
        gelatoVariantId: "var_456",
      });
      expect(result.success).toBe(true);
    });

    it("accepts service products with quote config", () => {
      const result = productSchema.safeParse({
        name: "CAD Design",
        slug: "cad-design",
        price: 0,
        type: "service",
        serviceConfig: { requiresQuote: true, deliveryDays: 5 },
      });
      expect(result.success).toBe(true);
    });
  });

  describe("orderSchema", () => {
    it("accepts valid order", () => {
      const result = orderSchema.safeParse({
        email: "customer@example.com",
        items: [{ productId: "p1", name: "Item", price: 1000, quantity: 1, type: "digital" }],
        total: 1000,
        status: "pending_payment",
      });
      expect(result.success).toBe(true);
    });

    it("accepts order with shipping address", () => {
      const result = orderSchema.safeParse({
        email: "test@example.com",
        items: [{ productId: "p1", name: "Item", price: 2000, quantity: 2, type: "pod" }],
        total: 4000,
        status: "paid",
        shippingAddress: {
          name: "Daniel Potter",
          line1: "123 Main St",
          city: "Melbourne",
          state: "VIC",
          postalCode: "3000",
          country: "AU",
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const result = orderSchema.safeParse({
        email: "test@test.com",
        items: [],
        total: 0,
        status: "invalid_status",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createPaymentIntentSchema", () => {
    it("accepts valid cart items", () => {
      const result = createPaymentIntentSchema.safeParse({
        items: [{ productId: "p1", name: "Widget", price: 1500, quantity: 1, type: "digital" }],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty items", () => {
      const result = createPaymentIntentSchema.safeParse({ items: [] });
      expect(result.success).toBe(false);
    });
  });

  describe("cartItemSchema", () => {
    it("accepts valid cart item", () => {
      const result = cartItemSchema.safeParse({
        productId: "p1",
        name: "Item",
        price: 999,
        quantity: 2,
        type: "service",
      });
      expect(result.success).toBe(true);
    });

    it("rejects quantity above max", () => {
      const result = cartItemSchema.safeParse({
        productId: "p1",
        name: "Item",
        price: 500,
        quantity: 200,
        type: "digital",
      });
      expect(result.success).toBe(false);
    });
  });
});
