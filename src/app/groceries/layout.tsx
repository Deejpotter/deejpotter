import type { ReactNode } from "react";
import { generatePageMetadata } from "@/app/metadata";
import { requireAdminPage } from "@/lib/admin-auth";

// The page is a client component, which can't export metadata, so it lives here.
export const metadata = generatePageMetadata(
  "Groceries Spend Visualiser",
  "Upload Woolworths order PDFs to track grocery spending by category, store, and month.",
  "/groceries"
);

// Grocery orders and spending are Deej's own, so the page is admin only.
export default async function Layout({ children }: { children: ReactNode }) {
  await requireAdminPage();
  return children;
}
