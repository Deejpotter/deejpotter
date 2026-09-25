import { describe, expect, test, vi } from "vitest";

// The laser check runs before any database or email work; mock them anyway
// so a regression can't reach a real service.
vi.mock("@/lib/db-quotes", () => ({ createQuote: vi.fn() }));
vi.mock("@/lib/db-users", () => ({ upsertUser: vi.fn() }));
vi.mock("@/lib/email", () => ({ notifyQuoteReceived: vi.fn() }));

import { POST } from "./route";

function laserRequest(operation?: string) {
  const form = new FormData();
  form.set("name", "Jane Doe");
  form.set("email", "jane@example.com");
  form.set("suburb", "Frankston");
  form.set("serviceType", "laser");
  form.set("material", "plywood_3mm");
  if (operation) form.set("operation", operation);
  return new Request("http://localhost/api/quotes", { method: "POST", body: form });
}

describe("POST /api/quotes laser jobs", () => {
  test.each(["cut", "both"])("rejects laser operation %s", async (operation) => {
    const res = await POST(laserRequest(operation));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/engraving only/i);
  });

  test("defaults laser jobs to engraving instead of rejecting them", async () => {
    const res = await POST(laserRequest());
    const json = await res.json();
    // Without a file it fails later on validation, but not with the laser-cutting error.
    expect(json.error ?? "").not.toMatch(/engraving only/i);
  });
});
