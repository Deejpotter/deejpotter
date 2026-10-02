import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
// @ts-expect-error plain .mjs script without type declarations
import { parseRedirects, renderYaml } from "../../scripts/render-routes.mjs";

const root = path.resolve(__dirname, "../..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");

describe("redirects", () => {
  test("render.yaml is up to date with public/_redirects", () => {
    // Render reads render.yaml and Cloudflare/Netlify read _redirects; if this
    // fails, run `node scripts/render-routes.mjs`.
    expect(read("render.yaml")).toBe(renderYaml(parseRedirects(read("public/_redirects"))));
  });

  test("business pages go to lumendot.com, and specific rules come before catch-alls", () => {
    const rules: { source: string; destination: string }[] = parseRedirects(read("public/_redirects"));
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      expect(rule.destination).toMatch(/^https:\/\/(lumendot\.com|github\.com)\//);
    }
    // Render doesn't document which of two matching rules wins, so keep the
    // more specific one first in case it uses the first match.
    const specific = rules.findIndex((r) => r.source === "/projects/services/3d-printing/*");
    const catchAll = rules.findIndex((r) => r.source === "/projects/services/*");
    expect(specific).toBeGreaterThanOrEqual(0);
    expect(specific).toBeLessThan(catchAll);
  });
});
