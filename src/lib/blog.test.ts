import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getAllPosts, getAllPostSlugs, getPostBySlug } from "./blog";

const tempDirs: string[] = [];
const originalMarkdownDir = process.env.BLOG_MARKDOWN_DIR;

function makeTempBlogDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "deejpotter-blog-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  process.env.BLOG_MARKDOWN_DIR = originalMarkdownDir;

  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("blog content loader", () => {
  it("loads markdown posts, excludes drafts by default, and still keeps existing TSX posts", () => {
    const dir = makeTempBlogDir();

    fs.writeFileSync(
      path.join(dir, "published-post.md"),
      `---
title: Published markdown post
slug: published-markdown-post
date: 2026-05-12
excerpt: A published markdown entry.
tags:
  - markdown
  - cms
draft: false
---

This is a published markdown post.`
    );

    fs.writeFileSync(
      path.join(dir, "draft-post.md"),
      `---
title: Draft markdown post
slug: hidden-draft-post
date: 2026-05-13
excerpt: This should stay hidden.
tags:
  - draft
draft: true
---

This draft should not appear publicly.`
    );

    process.env.BLOG_MARKDOWN_DIR = dir;

    const publishedPost = getPostBySlug("published-markdown-post");
    const draftPost = getPostBySlug("hidden-draft-post");
    const legacyTsxPost = getPostBySlug("box-shipping-calculator");
    const slugs = getAllPostSlugs();

    expect(publishedPost).toMatchObject({
      slug: "published-markdown-post",
      sourceType: "markdown",
      excerpt: "A published markdown entry.",
    });
    expect(draftPost).toBeNull();
    expect(legacyTsxPost?.sourceType).toBe("tsx");
    expect(slugs).toContain("published-markdown-post");
    expect(slugs).not.toContain("hidden-draft-post");
  });

  it("can include drafts when explicitly requested", () => {
    const dir = makeTempBlogDir();

    fs.writeFileSync(
      path.join(dir, "draft-post.md"),
      `---
title: Draft markdown post
slug: hidden-draft-post
date: 2026-05-13
excerpt: This should stay hidden by default.
tags:
  - draft
draft: true
---

This draft should only appear when drafts are included.`
    );

    process.env.BLOG_MARKDOWN_DIR = dir;

    const posts = getAllPosts({ includeDrafts: true });
    const draftPost = getPostBySlug("hidden-draft-post", { includeDrafts: true });

    expect(posts.some((post) => post.slug === "hidden-draft-post")).toBe(true);
    expect(draftPost).toMatchObject({
      slug: "hidden-draft-post",
      sourceType: "markdown",
      draft: true,
    });
  });
});
