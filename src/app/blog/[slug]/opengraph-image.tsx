import { ImageResponse } from "next/og";
import { getAllPostSlugs, getPostBySlug, formatDate } from "@/lib/blog";

/**
 * Social preview for each blog post. Without it every shared post showed the
 * same site-wide image, so links in chats and feeds looked identical; this
 * puts the post's own title on the card in the site's dark and green style.
 */

export const alt = "Blog post by Deej Potter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Posts are known at build time, so the cards are rendered once then.
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 15% 10%, #1E995255, transparent 45%), #030712",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 6, color: "#6ee7b7", textTransform: "uppercase" }}>
          deejpotter.com · Blog
        </div>
        <div style={{ fontSize: post && post.title.length > 60 ? 58 : 72, fontWeight: 900, lineHeight: 1.05 }}>
          {post?.title ?? "Blog"}
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
          <span>Deej Potter</span>
          {post && <span>{formatDate(post.date)}</span>}
          {post && <span>{post.readTime} min read</span>}
        </div>
      </div>
    ),
    size,
  );
}
