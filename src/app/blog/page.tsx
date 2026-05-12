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
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              Blog, build notes, and practical guides
            </span>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl">
              Articles that show how Deej thinks, builds, and solves problems
            </h1>
            <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
              This is where project write-ups, troubleshooting notes, website strategy, and hands-on technical work live.
              If you are deciding whether Deej is the right person to build your site or tool, this is the proof.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects/services/website-design"
                className="inline-flex items-center rounded-full bg-primary px-5 py-3 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
              >
                Explore website services
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-primary/30 px-5 py-3 font-semibold text-primary transition hover:bg-primary/5"
              >
                Start a conversation
              </Link>
              <a
                href="/blog/rss.xml"
                className="inline-flex items-center rounded-full border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Subscribe via RSS
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">What you will find here</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>website design and redesign thinking</li>
              <li>custom tool and workflow automation notes</li>
              <li>practical troubleshooting write-ups</li>
              <li>clear examples of how problems get solved</li>
            </ul>
          </div>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured posts</h2>
              <p className="text-gray-500 dark:text-gray-400">A quick starting point if you are new here.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredPosts.map((post) => (
              <article
                key={post.slug}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex h-full flex-col p-6">
                  <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span className="mx-2">·</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-primary">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mb-5 text-gray-700 dark:text-gray-300">{post.excerpt}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      >
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

      {tags.length > 0 && (
        <section className="rounded-3xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-semibold text-gray-900 dark:text-white">Popular topics:</span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 ? (
        <div
          className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200"
          role="alert"
        >
          <p className="mb-1 font-bold">No posts yet</p>
          <p className="mb-0">Check back soon for practical articles, build notes, and project lessons.</p>
        </div>
      ) : (
        <section className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All articles</h2>
            <p className="text-gray-500 dark:text-gray-400">Everything published so far, newest first.</p>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="p-6 lg:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>·</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-primary">
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && <p className="mb-4 text-gray-700 dark:text-gray-300">{post.excerpt}</p>}
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
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
