import Link from "next/link";

export const metadata = {
  title: "Payment Cancelled | Deej Potter",
  robots: { index: false },
};

export default async function CancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ quoteId?: string }>;
}) {
  const { quoteId } = await searchParams;

  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🕊️</div>
      <h1 className="text-3xl font-extrabold mb-4">Payment cancelled</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        No charge was made. Your quote is still saved and you can pay whenever you&apos;re ready.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {quoteId && (
          <Link
            href={`/projects/services/3d-printing/requests?quoteId=${quoteId}`}
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            View my quote
          </Link>
        )}
        <Link
          href="/projects/services/3d-printing"
          className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/10 transition-colors"
        >
          Back to 3D Printing
        </Link>
      </div>
    </main>
  );
}
