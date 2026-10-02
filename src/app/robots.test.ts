import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows the whole public site and points at the sitemap", () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;

    expect(rules).toMatchObject({ userAgent: "*", allow: "/" });
    expect(rules?.disallow).toBeUndefined();
    expect(config.sitemap).toBe("https://deejpotter.com/sitemap.xml");
  });
});
