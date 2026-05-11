import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows the public site while excluding internal paths from crawling", () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;

    expect(rules).toMatchObject({
      userAgent: "*",
      allow: "/",
    });
    expect(rules?.disallow).toEqual(expect.arrayContaining(["/admin", "/projects/services/3d-printing/requests"]));
    expect(config.sitemap).toBe("https://deejpotter.com/sitemap.xml");
  });
});
