import { beforeEach, describe, expect, test, vi } from "vitest";

const { authMock, currentUserMock } = vi.hoisted(() => ({ authMock: vi.fn(), currentUserMock: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth: authMock, currentUser: currentUserMock }));

import { getSessionUser, getSessionUserId } from "./session";

// The Clerk user fields session.ts reads, for a user with two addresses.
const clerkUser = (primaryStatus: string) => ({
  id: "user_1",
  firstName: "Sam",
  lastName: "Lee",
  primaryEmailAddressId: "em_2",
  primaryEmailAddress: { id: "em_2", emailAddress: "sam@example.com", verification: { status: primaryStatus } },
  emailAddresses: [
    { id: "em_1", emailAddress: "old@example.com", verification: { status: "verified" } },
    { id: "em_2", emailAddress: "sam@example.com", verification: { status: primaryStatus } },
  ],
});

describe("session helpers", () => {
  beforeEach(() => vi.clearAllMocks());

  test("getSessionUserId returns the signed-in id, or null", async () => {
    authMock.mockResolvedValueOnce({ userId: "user_1" });
    expect(await getSessionUserId()).toBe("user_1");
    authMock.mockResolvedValueOnce({ userId: null });
    expect(await getSessionUserId()).toBeNull();
  });

  test("treats an auth failure as signed out", async () => {
    authMock.mockRejectedValueOnce(new Error("no clerkMiddleware"));
    expect(await getSessionUserId()).toBeNull();
    currentUserMock.mockRejectedValueOnce(new Error("clerk down"));
    expect(await getSessionUser()).toBeNull();
  });

  test("uses the primary address, not the first one in the list", async () => {
    currentUserMock.mockResolvedValueOnce(clerkUser("verified"));
    expect(await getSessionUser()).toEqual({ id: "user_1", email: "sam@example.com", emailVerified: true, name: "Sam Lee" });
  });

  test("reports an unconfirmed primary address as unverified", async () => {
    currentUserMock.mockResolvedValueOnce(clerkUser("unverified"));
    expect((await getSessionUser())?.emailVerified).toBe(false);
  });

  test("leaves the name empty when none was given", async () => {
    currentUserMock.mockResolvedValueOnce({ ...clerkUser("verified"), firstName: null, lastName: null });
    expect((await getSessionUser())?.name).toBe("");
  });
});
