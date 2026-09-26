import type { Metadata } from "next";
import Link from "next/link";
import { hasClerk, requireAdminPage } from "@/lib/admin-auth";
import QuoteRequestsAdmin from "@/app/projects/services/3d-printing/QuoteRequestsAdmin";

export const metadata: Metadata = {
  title: "3D Printing Quotes | Admin",
  robots: { index: false },
};

export default async function Admin3DPrintingPage() {
  if (!hasClerk) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-3xl font-extrabold mb-4">3D Printing Quotes</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Authentication is not configured.
        </p>
        <Link href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90">
          Back to Home
        </Link>
      </main>
    );
  }

  await requireAdminPage();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 lg:py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1">3D Printing Quotes</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review new requests, set prices, manage statuses, and track print jobs.
        </p>
      </div>
      <QuoteRequestsAdmin />
    </div>
  );
}
