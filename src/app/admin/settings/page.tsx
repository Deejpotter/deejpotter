import type { Metadata } from "next";
import Link from "next/link";
import { hasClerk, requireAdminPage } from "@/lib/admin-auth";
import SettingsTabs from "./SettingsTabs";

export const metadata: Metadata = {
  title: "Settings | Admin | Deej Potter",
  robots: { index: false },
};

export default async function AdminSettingsPage() {
  if (!hasClerk) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold mb-4">Settings</h1>
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

  return <SettingsTabs />;
}
