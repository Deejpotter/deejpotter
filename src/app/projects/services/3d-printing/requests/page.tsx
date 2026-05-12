import { ReactElement } from "react";
import Link from "next/link";
import QuoteRequestsAdmin from "../QuoteRequestsAdmin";

export default function ThreeDPrintingQuoteRequestsPage(): ReactElement {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Internal workflow
            </p>
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              3D printing quote board
            </h1>
            <p className="max-w-3xl text-gray-600 dark:text-gray-400">
              Review incoming quote requests, download files, and track quote
              status, price, and turnaround from one place.
            </p>
          </div>
          <Link
            href="/projects/services/3d-printing"
            className="inline-flex items-center rounded-full border border-primary px-5 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] dark:text-white"
          >
            Back to service page
          </Link>
        </div>

        <QuoteRequestsAdmin />
      </div>
    </div>
  );
}
