import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags, getFeaturedPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Insights, Build Notes, and Website Strategy | Deej Potter",
  description:
    "Practical articles on websites, automation, custom tools, and the engineering decisions behind Deej Potter's client work.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPosts = getFeaturedPosts(3);
  const tags = getAllTags();

  return (
    <div className="space-y-10">
      <section className="rounded-4 bg-white dark:bg-gray-800 shadow-sm p-4 p-lg-5 border border-gray-100 dark:border-gray-700">
        <div className="row g-4 align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-primary-subtle text-primary-emphasis mb-3 px-3 py-2">
              Blog, build notes, and practical guides
            </span>
            <h1 className="display-5 fw-bold mb-3">Articles that show how Deej thinks, builds, and solves problems</h1>
            <p className="lead text-gray-700 dark:text-gray-300 mb-4">
              This is where project write-ups, troubleshooting notes, website strategy, and hands-on technical work live.
              If you are deciding whether Deej is the right person to build your site or tool, this is the proof.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link href="/projects/services/website-design" className="btn btn-primary btn-lg">
                Explore website services
              </Link>
              <Link href="/contact" className="btn btn-outline-primary btn-lg">
                Start a conversation
              </Link>
              <a href="/blog/rss.xml" className="btn btn-outline-secondary btn-lg">
                Subscribe via RSS
              </a>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bg-light dark:bg-gray-900 rounded-4 p-4 h-100 border border-gray-200 dark:border-gray-700">
              <h2 className="h5 fw-bold mb-3">What you will find here</h2>
              <ul className="mb-0 ps-3 text-gray-700 dark:text-gray-300">
                <li>website design and redesign thinking</li>
                <li>custom tool and workflow automation notes</li>
                <li>practical troubleshooting write-ups</li>
                <li>clear examples of how problems get solved</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <h2 className="h3 fw-bold mb-1">Featured posts</h2>
              <p className="text-muted mb-0">A quick starting point if you are new here.</p>
            </div>
          </div>

          <div className="row g-4">
            {featuredPosts.map((post) => (
              <div key={post.slug} className="col-lg-4">
                <article className="bg-white dark:bg-gray-800 rounded-4 shadow-sm border border-gray-100 dark:border-gray-700 h-100 overflow-hidden">
                  <div className="p-4 d-flex flex-column h-100">
                    <div className="text-muted small mb-2">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      {" · "}
                      <span>{post.readTime} min read</span>
                    </div>
                    <h3 className="h4 fw-bold mb-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors text-decoration-none"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                    <div className="mt-auto d-flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="badge bg-secondary text-white px-3 py-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>
      )}

      {tags.length > 0 && (
        <section className="rounded-4 bg-light dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="fw-semibold me-2">Popular topics:</span>
            {tags.map((tag) => (
              <span key={tag} className="badge rounded-pill bg-white text-dark border px-3 py-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 ? (
        <div
          className="bg-blue-100 border-start border-4 border-blue-500 text-blue-700 p-4 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300 rounded-3"
          role="alert"
        >
          <p className="fw-bold mb-1">No posts yet</p>
          <p className="mb-0">Check back soon for practical articles, build notes, and project lessons.</p>
        </div>
      ) : (
        <section className="space-y-4">
          <div>
            <h2 className="h3 fw-bold mb-1">All articles</h2>
            <p className="text-muted mb-0">Everything published so far, newest first.</p>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white dark:bg-gray-800 rounded-4 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 p-lg-5">
                  <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mb-3">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>·</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3 className="h2 fw-bold mb-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors text-decoration-none"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>}
                  <div className="d-flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="badge bg-secondary text-white px-3 py-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
