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
    <div>
      <section className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
          Technical Blog
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Project write-ups, implementation details, and technical challenges
          solved.
        </p>
      </section>

      {posts.length === 0 ? (
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300"
          role="alert"
        >
          <p className="font-bold">No posts yet!</p>
          <p>Check back soon for technical articles and project updates.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {" · "}
                  <span>{post.readTime} min read</span>
                </div>
                {post.excerpt && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-white bg-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
