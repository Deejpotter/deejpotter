import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("blog rss route", () => {
  it("returns RSS XML with blog metadata and at least one item", async () => {
    const response = await GET();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toContain("application/rss+xml");
    expect(body).toContain("<title>Deej Potter Blog</title>");
    expect(body).toContain("<link>https://deejpotter.com/blog</link>");
    expect(body).toContain("<item>");
    expect(body).toContain("/blog/");
  });
});
