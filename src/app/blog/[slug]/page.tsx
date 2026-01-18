import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug, formatDate } from "@/lib/blog";

// Type for page props
type PageProps = {
  params: {
    slug: string;
  };
};

/**
 * Generate static paths for all blog posts
 * This pre-renders all blog posts at build time
 */
export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * Generate metadata for each blog post (SEO)
 */
export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Deej Potter`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

/**
 * Individual blog post page
 * Renders content from TypeScript data files
 */
export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {/* Back to blog link */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/blog">Blog</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Article header */}
          <header className="mb-5">
            <h1 className="display-5 mb-3">{post.title}</h1>

            {/* Post metadata */}
            <div className="text-muted mb-4">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {" · "}
              <span>{post.readTime} min read</span>
            </div>

            {/* Post tags */}
            {post.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="badge bg-secondary text-white">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article content */}
          <article className="blog-content">{post.content}</article>

          {/* Link to full article in BookStack if available */}
          {post.bookstackUrl && (
            <div className="alert alert-info mt-4">
              <strong>Full Documentation:</strong> This post is also available
              with additional details in{" "}
              <a
                href={post.bookstackUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                BookStack
              </a>
              .
            </div>
          )}

          {/* Back to blog footer */}
          <footer className="mt-5 pt-4 border-top">
            <Link href="/blog" className="btn btn-outline-primary">
              ← Back to Blog
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
