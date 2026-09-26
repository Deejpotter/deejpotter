import type { ReactNode } from "react";
import { generatePageMetadata } from "@/app/metadata";

// The page is a client component, which can't export metadata, so it lives here.
export const metadata = generatePageMetadata(
  "Linear Cut Calculator",
  "Optimise linear material cuts from stock lengths to reduce offcuts and cost.",
  "/projects/tools/linear-cut-calculator"
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
