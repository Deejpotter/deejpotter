import Link from "next/link";

export const metadata = { title: "Payment Successful | Deej Potter" };

export default function CheckoutSuccessPage() {
  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-extrabold mb-4">Payment Successful</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Thank you for your order. You will receive a confirmation email shortly.
      </p>
      <Link href="/shop" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90">
        Continue Shopping
      </Link>
    </main>
  );
}
