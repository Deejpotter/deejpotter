import type { Metadata } from "next";
import Link from "next/link";
import { hasClerk, requireAdminPage } from "@/lib/admin-auth";
import LeadInbox from "./LeadInbox";
import { listContactLeads } from "@/lib/contact-leads";

export const metadata: Metadata = {
  title: "Lead Inbox | Deej Potter",
  description: "Private lead inbox for customer contact tracking.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LeadInboxPage() {
  if (!hasClerk) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold mb-4">Lead Inbox</h1>
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

  const leads = await listContactLeads();

  return (
    <div className="mx-auto max-w-6xl py-10 sm:py-12 lg:py-16">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Private admin</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Lead Inbox</h1>
        <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Review incoming contact forms, see where they came from, and update status as you follow up.
        </p>
      </div>
      <LeadInbox initialLeads={leads} />
    </div>
  );
}
