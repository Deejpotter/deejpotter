"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Error boundary for pages. Keeps the navbar and footer (the root layout)
 * and lets the visitor retry instead of seeing a blank page.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-bold">Something went wrong.</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          This page hit an error. Try again, and if it keeps happening let me know.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-gradient rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Try again
          </button>
          <Link
            href="/contact"
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:border-primary dark:border-white/15"
          >
            Report it
          </Link>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-gray-500">Reference: {error.digest}</p>
        )}
      </div>
    </section>
  );
}
