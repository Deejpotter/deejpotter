import { beforeEach, describe, expect, test, vi } from "vitest";

const { authMock, isAdminUserMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  isAdminUserMock: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: authMock }));
vi.mock("@/lib/admin-auth", () => ({ isAdminUser: isAdminUserMock }));

import { GET } from "./route";

describe("GET /api/admin/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("signed-out users are not admins", async () => {
    authMock.mockResolvedValue({ userId: null });
    const res = await GET();
    expect(await res.json()).toEqual({ isAdmin: false });
    expect(isAdminUserMock).not.toHaveBeenCalled();
  });

  test("uses the shared admin check for signed-in users", async () => {
    authMock.mockResolvedValue({ userId: "user_1" });
    isAdminUserMock.mockResolvedValue(true);
    const res = await GET();
    expect(await res.json()).toEqual({ isAdmin: true });
    expect(isAdminUserMock).toHaveBeenCalledWith("user_1");
  });

  test("hides the link if the admin check fails", async () => {
    authMock.mockResolvedValue({ userId: "user_1" });
    isAdminUserMock.mockRejectedValue(new Error("db down"));
    const res = await GET();
    expect(await res.json()).toEqual({ isAdmin: false });
  });
});
