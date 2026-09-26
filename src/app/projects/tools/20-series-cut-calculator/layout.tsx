import type { ReactNode } from "react";
import { generatePageMetadata } from "@/app/metadata";

// The page is a client component, which can't export metadata, so it lives here.
export const metadata = generatePageMetadata(
  "20 Series Cut Calculator",
  "Plan 20 series aluminium extrusion cuts with minimal waste using a best fit decreasing optimiser.",
  "/projects/tools/20-series-cut-calculator"
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
