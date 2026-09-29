import { Webhook } from "svix";
import { beforeEach, describe, expect, test, vi } from "vitest";

// A throwaway signing secret in Clerk's whsec_ format (base64 of 32 bytes).
const SECRET = `whsec_${Buffer.alloc(32, 7).toString("base64")}`;

let requestHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));

const upsertUser = vi.fn();
const deleteUser = vi.fn();
vi.mock("@/lib/db-users", () => ({
  upsertUser: (...args: unknown[]) => upsertUser(...args),
  deleteUser: (...args: unknown[]) => deleteUser(...args),
}));

import { POST } from "./route";

// Signs the body the way Clerk (via Svix) does, so the real check runs.
function signedRequest(body: string, secret = SECRET) {
  const id = "msg_test";
  const timestamp = new Date();
  requestHeaders = new Headers({
    "svix-id": id,
    "svix-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
    "svix-signature": new Webhook(secret).sign(id, timestamp, body),
  });
  return new Request("http://localhost/api/webhooks/clerk", { method: "POST", body }) as never;
}

describe("POST /api/webhooks/clerk", () => {
  beforeEach(() => {
    process.env.CLERK_WEBHOOK_SECRET = SECRET;
    upsertUser.mockReset();
    deleteUser.mockReset();
  });

  test("syncs a new user from a signed event", async () => {
    // Unusual spacing on purpose: the signature must be checked against the
    // exact text sent, not a re-serialised copy.
    const body = '{"type":"user.created",  "data":{"id":"user_1","first_name":"Sam","email_addresses":[{"email_address":"sam@example.com"}]}}';
    const res = await POST(signedRequest(body));
    expect(res.status).toBe(200);
    expect(upsertUser).toHaveBeenCalledWith({ clerkId: "user_1", email: "sam@example.com", name: "Sam" });
  });

  test("rejects an event signed with another secret", async () => {
    const body = JSON.stringify({ type: "user.deleted", data: { id: "user_1" } });
    const res = await POST(signedRequest(body, `whsec_${Buffer.alloc(32, 9).toString("base64")}`));
    expect(res.status).toBe(400);
    expect(deleteUser).not.toHaveBeenCalled();
  });
});
