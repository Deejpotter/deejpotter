import type { ReactNode } from "react";
import { generatePageMetadata } from "@/app/metadata";

// The page is a client component, which can't export metadata, so it lives here.
export const metadata = generatePageMetadata(
  "Groceries Spend Visualiser",
  "Upload Woolworths order PDFs to track grocery spending by category, store, and month.",
  "/groceries"
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
