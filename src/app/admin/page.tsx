import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { getQuoteStats } from "@/lib/db-quotes";
import { listContactLeads } from "@/lib/contact-leads";

export const metadata: Metadata = {
  title: "Admin Dashboard | Deej Potter",
  robots: { index: false },
};

async function getStats() {
  try {
    const [stats, leads] = await Promise.all([
      getQuoteStats().catch(() => ({ newQuotes: 0, pendingQuotes: 0, activeJobs: 0, completedToday: 0 })),
      listContactLeads().catch(() => []),
    ]);

    return {
      newQuotes: stats.newQuotes,
      pendingQuotes: stats.pendingQuotes,
      activePrints: stats.activeJobs,
      totalLeads: leads.length,
    };
  } catch {
    return { newQuotes: 0, pendingQuotes: 0, activePrints: 0, totalLeads: 0 };
  }
}

export default async function AdminDashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  // Check admin role from Clerk publicMetadata
  const role = user.publicMetadata?.role as string | undefined;
  if (role !== "admin") {
    redirect("/");
  }

  const stats = await getStats();

  const cards = [
    { label: "New quote requests", value: stats.newQuotes, href: "/admin/3d-printing", color: "bg-amber-500" },
    { label: "Pending payment", value: stats.pendingQuotes, href: "/admin/3d-printing", color: "bg-blue-500" },
    { label: "Active prints", value: stats.activePrints, href: "/admin/3d-printing", color: "bg-green-500" },
    { label: "Contact leads", value: stats.totalLeads, href: "/admin/leads", color: "bg-purple-500" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 sm:py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 className="text-4xl font-extrabold tracking-tight mt-1">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage quotes, materials, and site settings.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${card.color}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{card.label}</span>
            </div>
            <div className="text-3xl font-bold mt-2">{card.value}</div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold">Admin sections</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <AdminNavItem href="/admin/3d-printing" title="3D Printing Quotes" desc="Review, price, and manage print quote requests" />
          <AdminNavItem href="/admin/leads" title="Lead Inbox" desc="View and manage contact form submissions" />
          <AdminNavItem href="/admin/settings" title="Settings" desc="Test mode toggle, Stripe status, materials config" />
        </div>
      </div>
    </main>
  );
}

function AdminNavItem({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{desc}</div>
    </Link>
  );
}
