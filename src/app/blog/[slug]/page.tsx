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
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        {/* Back to blog link */}
        <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-300">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/blog"
                className="font-semibold text-emerald-700 transition hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
              >
                Blog
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">
              /
            </li>
            <li className="text-slate-900 dark:text-slate-100">{post.title}</li>
          </ol>
        </nav>

        {/* Article header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white">{post.title}</h1>

          {/* Post metadata */}
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true" className="px-2 text-slate-400">
              •
            </span>
            <span>{post.readTime} min read</span>
          </div>

          {/* Post tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article content */}
        <article className="blog-content prose prose-emerald max-w-none dark:prose-invert">{post.content}</article>

        {/* Link to full article in BookStack if available */}
        {post.bookstackUrl && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100">
            <strong>Full Documentation:</strong> This post is also available with additional details in{" "}
            <a
              href={post.bookstackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-emerald-500 decoration-2 underline-offset-4"
            >
              BookStack
            </a>
            .
          </div>
        )}

        {/* Back to blog footer */}
        <footer className="border-t border-slate-200 pt-6 dark:border-slate-800">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
          >
            ← Back to Blog
          </Link>
        </footer>
      </div>
    </div>
  );
}
