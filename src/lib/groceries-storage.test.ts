import { beforeEach, describe, expect, test, vi } from "vitest";
import { createFakeCollection } from "@/test-utils/fake-collection";

// Orders are stored in MongoDB; use an in-memory collection instead.
const { orders } = vi.hoisted(() => ({ orders: { current: null as unknown } }));
vi.mock("./db", () => ({
  getCollection: async () => orders.current,
}));

import {
  deleteOrder,
  getOrder,
  getSpendingSummary,
  listOrders,
  orderExists,
  saveOrder,
  type GroceryOrder,
} from "./groceries-storage";

function makeOrder(overrides: Partial<GroceryOrder> = {}): GroceryOrder {
  return {
    store_name: "Coles",
    date: "2026-09-01",
    order_number: "1001",
    items: [
      { name: "Milk", quantity: 1, unit_price: 3.1, total_price: 3.1, category: "Dairy" },
      { name: "Bread", quantity: 2, unit_price: 4, total_price: 8, category: "Bakery" },
    ],
    subtotal: 11.1,
    total: 11.1,
    importedAt: "2026-09-02T00:00:00.000Z",
    ...overrides,
  };
}

describe("groceries storage", () => {
  beforeEach(() => {
    orders.current = createFakeCollection();
  });

  test("saves, finds, and lists orders newest first without Mongo ids", async () => {
    await saveOrder(makeOrder({ order_number: "1001", date: "2026-09-01" }));
    await saveOrder(makeOrder({ order_number: "1002", date: "2026-09-10", store_name: "Aldi" }));

    expect(await orderExists("1001")).toBe(true);
    expect(await orderExists("9999")).toBe(false);

    const list = await listOrders();
    expect(list.map((o) => o.order_number)).toEqual(["1002", "1001"]);
    expect(list[0]).toEqual({
      order_number: "1002",
      date: "2026-09-10",
      store_name: "Aldi",
      total: 11.1,
      item_count: 2,
    });

    const order = await getOrder("1001");
    expect(order?.store_name).toBe("Coles");
    expect(order).not.toHaveProperty("_id");
  });

  test("re-saving an order replaces it instead of duplicating it", async () => {
    await saveOrder(makeOrder({ total: 11.1 }));
    await saveOrder(makeOrder({ total: 20 }));

    const list = await listOrders();
    expect(list).toHaveLength(1);
    expect(list[0].total).toBe(20);
  });

  test("a concurrent insert of the same order ends up as one replaced order", async () => {
    const fake = orders.current as ReturnType<typeof createFakeCollection>;
    const realReplace = fake.replaceOne.bind(fake);
    let calls = 0;
    // Simulate losing the race: another request inserts the order first and
    // our upsert hits the unique index.
    fake.replaceOne = async (filter, replacement, options) => {
      calls++;
      if (calls === 1) {
        await realReplace(filter, { ...replacement, total: 1 }, { upsert: true });
        throw Object.assign(new Error("E11000 duplicate key"), { code: 11000 });
      }
      return realReplace(filter, replacement, options);
    };

    await saveOrder(makeOrder({ total: 20 }));

    const list = await listOrders();
    expect(list).toHaveLength(1);
    expect(list[0].total).toBe(20);
  });

  test("other write errors are not swallowed", async () => {
    const fake = orders.current as ReturnType<typeof createFakeCollection>;
    fake.replaceOne = async () => {
      throw Object.assign(new Error("network"), { code: 6 });
    };

    await expect(saveOrder(makeOrder())).rejects.toThrow("network");
  });

  test("deletes orders", async () => {
    await saveOrder(makeOrder());

    expect(await deleteOrder("1001")).toBe(true);
    expect(await deleteOrder("1001")).toBe(false);
    expect(await getOrder("1001")).toBeNull();
  });

  test("summarises spending by store, category, and month", async () => {
    await saveOrder(makeOrder({ order_number: "1001", date: "2026-08-20" }));
    await saveOrder(makeOrder({ order_number: "1002", date: "2026-09-10", store_name: "Aldi" }));

    const summary = await getSpendingSummary();
    expect(summary.total_orders).toBe(2);
    expect(summary.total_spend).toBe(22.2);
    expect(summary.by_store).toEqual({ Coles: 11.1, Aldi: 11.1 });
    expect(summary.by_category).toEqual({ Bakery: 16, Dairy: 6.2 });
    expect(Object.keys(summary.by_month)).toEqual(["2026-08", "2026-09"]);
  });
});
