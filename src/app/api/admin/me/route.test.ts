import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));

// Only the auth provider is faked; the real session and admin helpers run.
vi.mock("@clerk/nextjs/server", () => ({ auth: authMock, currentUser: vi.fn() }));

import { GET } from "./route";

describe("GET /api/admin/me", () => {
  const original = process.env.ADMIN_USER_IDS;
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_USER_IDS = "user_admin";
  });
  afterEach(() => {
    process.env.ADMIN_USER_IDS = original;
  });

  test("signed-out users are not admins", async () => {
    authMock.mockResolvedValue({ userId: null });
    expect(await (await GET()).json()).toEqual({ isAdmin: false });
  });

  test("a listed user is an admin", async () => {
    authMock.mockResolvedValue({ userId: "user_admin" });
    expect(await (await GET()).json()).toEqual({ isAdmin: true });
  });

  test("a signed-in customer is not", async () => {
    authMock.mockResolvedValue({ userId: "user_customer" });
    expect(await (await GET()).json()).toEqual({ isAdmin: false });
  });

  test("hides the link if auth fails", async () => {
    authMock.mockRejectedValue(new Error("clerk down"));
    expect(await (await GET()).json()).toEqual({ isAdmin: false });
  });
});
