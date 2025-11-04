import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

// Page metadata
export const metadata: Metadata = {
  title: "Technical Blog | Deej Potter",
  description:
    "Technical write-ups and project documentation. Implementation details, challenges solved, and lessons learned.",
};

/**
 * Blog listing page
 * Displays all blog posts sorted by date
 */
export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {/* Page header */}
          <header className="mb-5">
            <h1 className="display-4 mb-3">Technical Blog</h1>
            <p className="lead text-muted">
              Project write-ups, implementation details, and technical
              challenges solved.
            </p>
          </header>

          {/* Blog posts list */}
          {posts.length === 0 ? (
            <div className="alert alert-info">
              No blog posts yet. Check back soon!
            </div>
          ) : (
            <div className="row g-4">
              {posts.map((post) => (
                <div key={post.slug} className="col-12">
                  <article className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      {/* Post title */}
                      <h2 className="h4 card-title mb-3">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-decoration-none text-dark stretched-link"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      {/* Post metadata */}
                      <div className="text-muted small mb-3">
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                        {" · "}
                        <span>{post.readTime} min read</span>
                      </div>

                      {/* Post excerpt */}
                      {post.excerpt && (
                        <p className="card-text text-muted mb-3">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Post tags */}
                      {post.tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="badge bg-secondary text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
