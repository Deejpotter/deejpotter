import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { listQuotes } from "@/lib/db-quotes";
import PayNowButton from "@/components/PayNowButton";

type QuoteRecord = Awaited<ReturnType<typeof listQuotes>>[number];

export const metadata = {
  title: "My Account | Deej Potter",
  robots: { index: false },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200" },
  reviewing: { label: "Reviewing", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200" },
  quoted: { label: "Quoted", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200" },
  awaiting_payment: { label: "Awaiting Payment", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200" },
  in_progress: { label: "In Progress", color: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200" },
  ready: { label: "Ready", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200" },
  completed: { label: "Completed", color: "bg-green-200 text-green-900 dark:bg-green-900/50 dark:text-green-200" },
  declined: { label: "Declined", color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const email =
    user.emailAddresses?.[0]?.emailAddress ||
    user.primaryEmailAddress?.emailAddress ||
    "";

  const quotes = await listQuotes({ userEmail: email, limit: 50 }).catch(
    () => [],
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 sm:py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          My Account
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight mt-1">
          Welcome, {user.firstName || "there"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your quote requests and order history.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold">Your Quotes</h2>
          <Link
            href="/projects/services/3d-printing"
            className="text-sm text-primary hover:underline"
          >
            + New quote request
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven&apos;t submitted any quote requests yet.
            </p>
            <Link
              href="/projects/services/3d-printing"
              className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Get a quote
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {quotes.map((quote) => {
              const status = STATUS_LABELS[quote.status] || STATUS_LABELS.new;
              return (
                <div
                  key={quote.quoteNumber || quote._id}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm text-gray-500">
                          #{quote.quoteNumber}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {quote.fileName || `${quote.serviceType.replace("_", " ")} quote`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(quote.createdAt).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      {quote.quotedPrice ? (
                        <div className="font-semibold">
                          ${quote.quotedPrice.toFixed(2)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Awaiting quote</div>
                      )}
                      {quote.turnaroundEstimate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {quote.turnaroundEstimate}
                        </div>
                      )}
                      {(quote.status === "quoted" || quote.status === "awaiting_payment") &&
                        quote.quotedPrice && (
                          <PayNowButton quoteNumber={quote.quoteNumber} />
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
