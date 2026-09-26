import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

/**
 * Site-wide 404. Rendered for unknown URLs and whenever a page calls notFound().
 */
export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[60vh] items-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="mx-auto max-w-xl text-center">
        <p className="text-gradient text-6xl font-black">404</p>
        <h1 className="mt-4 text-3xl font-bold">That page doesn&apos;t exist.</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          It may have moved, or the link might be wrong. Try one of these instead.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-gradient rounded-full px-5 py-2.5 text-sm font-semibold">
            Home
          </Link>
          <Link
            href="/projects/services"
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:border-primary dark:border-white/15"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:border-primary dark:border-white/15"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
