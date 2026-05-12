import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPostSlugs, getPostBySlug, formatDate } from "@/lib/blog";

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post Not Found" };
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

function renderMarkdown(markdown: string) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary" />,
        pre: ({ children }) => (
          <pre className="my-4 overflow-auto rounded-2xl bg-gray-100 p-4 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">{children}</pre>
        ),
        code: ({ className, children, ...props }) => (
          <code className={`rounded bg-gray-100 px-1.5 py-0.5 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100 ${className || ""}`} {...props}>
            {children}
          </code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-4 border-primary/50 pl-4 text-gray-600 dark:text-gray-300">{children}</blockquote>
        ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-left text-sm dark:border-gray-700">{children}</table>
          </div>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl py-8 sm:py-12 lg:py-16">
      <nav aria-label="breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/blog" className="transition-colors hover:text-primary">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-700 dark:text-gray-200">{post.title}</li>
        </ol>
      </nav>

      <header className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8 lg:p-10">
        <h1 className="mb-3 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl">
          {post.title}
        </h1>
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <article className="blog-content rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8 lg:p-10">
        {post.sourceType === "markdown" && post.markdown ? renderMarkdown(post.markdown) : post.content}
      </article>

      {post.bookstackUrl && (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
          <strong>Full Documentation:</strong> This post is also available with additional details in{" "}
          <a href={post.bookstackUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-blue-400 underline-offset-4">
            BookStack
          </a>
          .
        </div>
      )}

      <footer className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
        <Link
          href="/blog"
          className="inline-flex items-center rounded-full border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          ← Back to Blog
        </Link>
      </footer>
    </div>
  );
}
