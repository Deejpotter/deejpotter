import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists the personal pages and write-ups, and none of the moved business pages", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://deejpotter.com/projects/games/geek-pride-day");
    expect(urls).toContain("https://deejpotter.com/projects/games/basic-bases/basic-bases-privacy");
    expect(urls).toContain("https://deejpotter.com/blog/openclaw-android-pairing-request-churn");
    expect(urls.some((url) => url.includes("/projects/services"))).toBe(false);
    expect(urls).not.toContain("https://deejpotter.com/contact");
  });
});
