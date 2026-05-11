import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: number;
  bookstackUrl?: string;
  draft?: boolean;
  sourceType?: "tsx" | "markdown";
  content?: React.ReactNode;
  markdown?: string;
};

export type BlogPostMetadata = Omit<BlogPost, "content" | "markdown">;

type MarkdownFrontmatter = {
  title?: string;
  slug?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  draft?: boolean;
  bookstackUrl?: string;
};

export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const trimmed = text.trim();
  if (!trimmed) return 1;
  const wordCount = trimmed.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

import { boxShippingPost } from "../content/blog/box-shipping-calculator";
import { cncAiPost } from "../content/blog/cnc-technical-ai";
import { portfolioMigrationPost } from "../content/blog/portfolio-migration";
import { esp32CarPost } from "../content/blog/esp32-wireless-car";

const tsxBlogPosts: BlogPost[] = [
  boxShippingPost,
  cncAiPost,
  portfolioMigrationPost,
  esp32CarPost,
].map((post) => ({
  ...post,
  draft: false,
  sourceType: "tsx" as const,
}));

function getMarkdownPostsDir(): string {
  return process.env.BLOG_MARKDOWN_DIR || path.join(process.cwd(), "src", "content", "blog-md");
}

function loadMarkdownPosts(): BlogPost[] {
  const postsDir = getMarkdownPostsDir();
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const posts = fs
    .readdirSync(postsDir)
    .filter((fileName) => /\.md$/i.test(fileName))
    .map((fileName): BlogPost | null => {
      const fullPath = path.join(postsDir, fileName);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(raw);
      const frontmatter = data as MarkdownFrontmatter;

      if (!frontmatter.title || !frontmatter.slug || !frontmatter.date) {
        return null;
      }

      const excerpt = frontmatter.excerpt?.trim() || content.trim().split(/\n\n+/)[0] || "";

      return {
        slug: frontmatter.slug,
        title: frontmatter.title,
        date: frontmatter.date,
        excerpt,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        readTime: calculateReadTime(content),
        bookstackUrl: frontmatter.bookstackUrl,
        draft: frontmatter.draft ?? false,
        sourceType: "markdown",
        markdown: content,
      };
    });

  return posts.filter((post): post is BlogPost => post !== null);
}

function getAllBlogPosts({ includeDrafts = false }: { includeDrafts?: boolean } = {}): BlogPost[] {
  const combined = [...loadMarkdownPosts(), ...tsxBlogPosts];
  const deduped = new Map<string, BlogPost>();

  for (const post of combined) {
    if (!includeDrafts && post.draft) {
      continue;
    }
    if (!deduped.has(post.slug)) {
      deduped.set(post.slug, post);
    }
  }

  return Array.from(deduped.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllPostSlugs(options?: { includeDrafts?: boolean }): string[] {
  return getAllBlogPosts(options).map((post) => post.slug);
}

export function getPostBySlug(slug: string, options?: { includeDrafts?: boolean }): BlogPost | null {
  const post = getAllBlogPosts(options).find((entry) => entry.slug === slug);
  return post || null;
}

export function getAllPosts(options?: { includeDrafts?: boolean }): BlogPostMetadata[] {
  return getAllBlogPosts(options).map(({ content, markdown, ...metadata }) => metadata);
}

export function getFeaturedPosts(limit = 3): BlogPostMetadata[] {
  return getAllPosts().slice(0, limit);
}

export function getPostsByTag(tag: string): BlogPostMetadata[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
