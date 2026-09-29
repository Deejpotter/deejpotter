import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth: authMock, currentUser: vi.fn() }));
vi.mock("@/lib/groceries-storage", () => ({
  listOrders: async () => [{ order_number: "1" }],
  getSpendingSummary: async () => ({ total: 42 }),
  deleteOrder: async () => true,
}));

import { GET } from "./route";

// Grocery orders are Deej's own spending, so being signed in isn't enough.
describe("GET /api/groceries/list", () => {
  const original = process.env.ADMIN_USER_IDS;
  beforeEach(() => {
    process.env.ADMIN_USER_IDS = "user_admin";
  });
  afterEach(() => {
    process.env.ADMIN_USER_IDS = original;
  });

  test("refuses signed-out visitors", async () => {
    authMock.mockResolvedValueOnce({ userId: null });
    expect((await GET()).status).toBe(401);
  });

  test("refuses a signed-in customer", async () => {
    authMock.mockResolvedValueOnce({ userId: "user_customer" });
    expect((await GET()).status).toBe(403);
  });

  test("returns the orders to an admin", async () => {
    authMock.mockResolvedValueOnce({ userId: "user_admin" });
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ summary: { total: 42 } });
  });
});
