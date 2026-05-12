import type { Metadata } from "next";
import LeadInbox from "./LeadInbox";
import { listContactLeads } from "@/lib/contact-leads";

async function getAuthAsync() {
  try {
    const clerk = await import("@clerk/nextjs");
    const anyClerk = clerk as any;
    const getter =
      typeof anyClerk?.auth === "function"
        ? anyClerk.auth
        : typeof anyClerk?.getAuth === "function"
          ? anyClerk.getAuth
          : () => ({ userId: null });
    return getter();
  } catch {
    return { userId: null };
  }
}

export const metadata: Metadata = {
  title: "Lead Inbox | Deej Potter",
  description: "Private lead inbox for customer contact tracking.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LeadInboxPage() {
  const { userId } = await getAuthAsync();
  if (!userId) {
    return (
      <div className="mx-auto max-w-4xl py-16">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">Lead Inbox</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to view customer leads.
          </p>
        </div>
      </div>
    );
  }

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
