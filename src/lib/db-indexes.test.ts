import { describe, expect, test, vi } from "vitest";
import type { Db } from "mongodb";
import { ensureIndexes } from "./db";

describe("ensureIndexes", () => {
  test("creates the unique indexes and keeps going when one fails", async () => {
    const created: { collection: string; keys: unknown; options: unknown }[] = [];
    const db = {
      collection: (collection: string) => ({
        createIndex: async (keys: Record<string, number>, options: unknown) => {
          if (collection === "users" && "clerkId" in keys) {
            throw new Error("E11000 duplicate key");
          }
          created.push({ collection, keys, options });
          return "ok";
        },
      }),
    } as unknown as Db;
    const logError = vi.spyOn(console, "error").mockImplementation(() => {});

    await ensureIndexes(db);

    expect(created).toContainEqual({
      collection: "grocery_orders",
      keys: { order_number: 1 },
      options: { unique: true },
    });
    expect(created).toContainEqual({
      collection: "contact_leads",
      keys: { id: 1 },
      options: { unique: true },
    });
    expect(logError).toHaveBeenCalledTimes(1);
    logError.mockRestore();
  });
});
