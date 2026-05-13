import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes service pages, rss, and blog posts", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://deejpotter.com/projects/services/website-design");
    expect(urls).toContain("https://deejpotter.com/projects/services/website-redesign");
    expect(urls).toContain("https://deejpotter.com/projects/services/custom-tools");
    expect(urls).toContain("https://deejpotter.com/projects/games/geek-pride-day");
    expect(urls).toContain("https://deejpotter.com/blog/rss.xml");
    expect(urls).toContain("https://deejpotter.com/blog/openclaw-android-pairing-request-churn");
  });
});
