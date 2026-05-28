import Link from "next/link";

export const metadata = { title: "Payment Cancelled | Deej Potter" };

export default function CheckoutCancelledPage() {
  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-3xl font-extrabold mb-4">Payment Cancelled</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Your payment was not processed. No charges were made.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/shop/checkout" className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90">
          Try Again
        </Link>
        <Link href="/shop" className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700">
          Browse Shop
        </Link>
      </div>
    </main>
  );
}
