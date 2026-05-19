import Link from "next/link";

export const metadata = {
  title: "Payment Received | Deej Potter",
  robots: { index: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ quoteId?: string; session_id?: string }>;
}) {
  const { quoteId } = await searchParams;

  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-extrabold mb-4">Payment received!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Your payment went through. I'll start working on your print and send you an update.
      </p>

      {quoteId && (
        <p className="text-sm text-gray-500 mb-8">
          Reference: <code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{quoteId}</code>
        </p>
      )}

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8 text-left">
        <h2 className="font-semibold mb-2">What happens next?</h2>
        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>1. I'll review your model and prepare it for printing</li>
          <li>2. If there are any issues, I'll reach out to your email</li>
          <li>3. Your print will be completed and shipped or ready for pickup</li>
        </ol>
      </div>

      <Link
        href="/projects/services/3d-printing"
        className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90 transition-colors"
      >
        Back to 3D Printing
      </Link>
    </main>
  );
}
