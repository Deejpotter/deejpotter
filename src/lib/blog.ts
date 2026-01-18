// Type definitions for blog posts
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: React.ReactNode;
  readTime: number; // minutes
  bookstackUrl?: string; // Link to full article in BookStack
};

export type BlogPostMetadata = Omit<BlogPost, "content">;

/**
 * Calculate estimated read time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime;
}

// Blog posts data
// Import post content from separate files
import { boxShippingPost } from "../content/blog/box-shipping-calculator";
import { cncAiPost } from "../content/blog/cnc-technical-ai";
import { portfolioMigrationPost } from "../content/blog/portfolio-migration";
import { esp32CarPost } from "../content/blog/esp32-wireless-car";

const blogPosts: BlogPost[] = [
  boxShippingPost,
  cncAiPost,
  portfolioMigrationPost,
  esp32CarPost,
];

/**
 * Get all blog post slugs
 */
export function getAllPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const post = blogPosts.find((p) => p.slug === slug);
  return post || null;
}

/**
 * Get all blog posts with metadata (no content)
 * Sorted by date (newest first)
 */
export function getAllPosts(): BlogPostMetadata[] {
  return blogPosts
    .map((post) => {
      const { content, ...metadata } = post;
      return metadata;
    })
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

/**
 * Get blog posts filtered by tag
 */
export function getPostsByTag(tag: string): BlogPostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

/**
 * Get all unique tags used across all posts
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tagSet = new Set<string>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
