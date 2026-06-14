import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import QuoteRequestsAdmin from "@/app/projects/services/3d-printing/QuoteRequestsAdmin";

export const metadata: Metadata = {
  title: "3D Printing Quotes | Admin",
  robots: { index: false },
};

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default async function Admin3DPrintingPage() {
  if (!hasClerk) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold mb-4">3D Printing Quotes</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Authentication is not configured. Set <code className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-sm font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-sm font-mono">CLERK_SECRET_KEY</code> in your <code className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-sm font-mono">.env.local</code> to enable the admin panel.
        </p>
        <Link href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90">
          Back to Home
        </Link>
      </main>
    );
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const role = user.publicMetadata?.role as string | undefined;
  if (role !== "admin") {
    redirect("/");
  }

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
