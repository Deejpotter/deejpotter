import type { Metadata } from "next";
import QuoteRequestsAdmin from "@/app/projects/services/3d-printing/QuoteRequestsAdmin";

export const metadata: Metadata = {
  title: "3D Printing Quotes | Admin",
  robots: { index: false },
};

export default function Admin3DPrintingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 className="text-4xl font-extrabold tracking-tight mt-1">3D Printing Quotes</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review new requests, set prices, manage statuses, and track print jobs.
        </p>
      </div>
      <QuoteRequestsAdmin />
    </div>
  );
}
