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
        a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        pre: ({ children }) => <pre className="p-3 rounded bg-light overflow-auto">{children}</pre>,
        code: ({ className, children, ...props }) => (
          <code className={className} {...props}>
            {children}
          </code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-start border-4 ps-3 text-muted my-4">{children}</blockquote>
        ),
        table: ({ children }) => (
          <div className="table-responsive my-4">
            <table className="table table-striped table-bordered align-middle">{children}</table>
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
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
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

          <header className="mb-5">
            <h1 className="display-5 mb-3">{post.title}</h1>
            <div className="text-muted mb-4">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {" · "}
              <span>{post.readTime} min read</span>
            </div>

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

          <article className="blog-content">
            {post.sourceType === "markdown" && post.markdown
              ? renderMarkdown(post.markdown)
              : post.content}
          </article>

          {post.bookstackUrl && (
            <div className="alert alert-info mt-4">
              <strong>Full Documentation:</strong> This post is also available with additional details in{" "}
              <a href={post.bookstackUrl} target="_blank" rel="noopener noreferrer">
                BookStack
              </a>
              .
            </div>
          )}

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
