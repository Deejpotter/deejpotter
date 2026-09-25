import { beforeEach, describe, expect, test, vi } from "vitest";

const { updateOne } = vi.hoisted(() => ({ updateOne: vi.fn() }));
vi.mock("./db", () => ({
  getCollection: async () => ({ updateOne }),
}));

import { upsertUser } from "./db-users";

describe("upsertUser", () => {
  beforeEach(() => {
    updateOne.mockReset();
  });

  test("does not overwrite an existing role when none is passed", async () => {
    await upsertUser({ clerkId: "user_1", email: "Deej@Example.com", name: "Deej" });

    const [filter, update, options] = updateOne.mock.calls[0];
    expect(filter).toEqual({ clerkId: "user_1" });
    expect(update.$set).not.toHaveProperty("role");
    expect(update.$set.email).toBe("deej@example.com");
    // New users still start as customers.
    expect(update.$setOnInsert.role).toBe("customer");
    expect(options).toEqual({ upsert: true });
  });

  test("sets the role when one is passed explicitly", async () => {
    await upsertUser({ clerkId: "user_1", email: "deej@example.com", name: "Deej", role: "admin" });

    const [, update] = updateOne.mock.calls[0];
    expect(update.$set.role).toBe("admin");
    // Never in both $set and $setOnInsert (MongoDB rejects that).
    expect(update.$setOnInsert).not.toHaveProperty("role");
  });
});
