import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

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
