import { afterEach, beforeEach, expect, test, vi } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

vi.mock("@clerk/nextjs", () => ({
  auth: () => ({ userId: "user_123" }),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => ({ userId: "user_123" }),
}));

vi.mock("@/lib/db-users", () => ({
  isAdmin: () => Promise.resolve(true),
}));

const tempDir = path.join(process.cwd(), "tmp", "contact-leads-test");

beforeEach(async () => {
  process.env.CONTACT_LEADS_DIR = tempDir;
  await fs.rm(tempDir, { recursive: true, force: true });
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
  delete process.env.CONTACT_LEADS_DIR;
});

test("contact route stores lead data", async () => {
  const { POST } = await import("./route");

  const response = await POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        email: "jane@example.com",
        company: "Example Co",
        projectType: "website",
        source: "google",
        message: "Please help with a site redesign.",
        leadContext: {
          currentPath: "/contact",
          referrer: "https://google.com",
          source: "Google",
          utmSource: "",
          utmMedium: "",
          utmCampaign: "",
          utmTerm: "",
          utmContent: "",
        },
      }),
    })
  );

  expect(response.ok).toBe(true);
  const json = await response.json();
  expect(json.ok).toBe(true);
  expect(json.requestId).toBeTruthy();

  const indexPath = path.join(tempDir, "index.json");
  const raw = await fs.readFile(indexPath, "utf8");
  const records = JSON.parse(raw);
  expect(records).toHaveLength(1);
  expect(records[0].email).toBe("jane@example.com");
  expect(records[0].leadContext.source).toBe("Google");
});

test("contact route lists leads for authenticated admin users", async () => {
  const { POST, GET } = await import("./route");

  await POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Please help with a site redesign.",
      }),
    })
  );

  const response = await GET();
  expect(response.ok).toBe(true);
  const leads = await response.json();
  expect(leads).toHaveLength(1);
  expect(leads[0].name).toBe("Jane Doe");
});

test("contact route updates lead status for authenticated admin users", async () => {
  const { POST, PATCH } = await import("./route");

  const postResponse = await POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Please help with a site redesign.",
      }),
    })
  );
  const created = await postResponse.json();

  const response = await PATCH(
    new Request("http://localhost/api/contact", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: created.requestId, status: "reviewed" }),
    })
  );

  expect(response.ok).toBe(true);
  const lead = await response.json();
  expect(lead.status).toBe("reviewed");
});
