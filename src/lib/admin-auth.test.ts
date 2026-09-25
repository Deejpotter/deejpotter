import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { getAdminUserIds, isAdminUser } from "./admin-auth";

describe("admin access from ADMIN_USER_IDS", () => {
  const original = process.env.ADMIN_USER_IDS;
  afterEach(() => {
    process.env.ADMIN_USER_IDS = original;
  });

  test("allows listed user IDs, trimming spaces and ignoring empty entries", async () => {
    process.env.ADMIN_USER_IDS = " user_owner , ,user_second ";
    expect(getAdminUserIds()).toEqual(new Set(["user_owner", "user_second"]));
    expect(await isAdminUser("user_owner")).toBe(true);
    expect(await isAdminUser("user_second")).toBe(true);
  });

  test("denies users who aren't listed", async () => {
    process.env.ADMIN_USER_IDS = "user_owner";
    expect(await isAdminUser("user_someone_else")).toBe(false);
  });

  test("nobody is an admin when the variable is missing or empty", async () => {
    delete process.env.ADMIN_USER_IDS;
    expect(await isAdminUser("user_owner")).toBe(false);
    process.env.ADMIN_USER_IDS = "";
    expect(await isAdminUser("")).toBe(false);
  });
});
