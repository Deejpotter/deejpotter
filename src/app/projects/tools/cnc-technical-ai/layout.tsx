import type { ReactNode } from "react";
import { generatePageMetadata } from "@/app/metadata";

// The page is a client component, which can't export metadata, so it lives here.
export const metadata = generatePageMetadata(
  "CNC Technical AI",
  "Ask technical questions about CNC machines, extrusions, and builds.",
  "/projects/tools/cnc-technical-ai"
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
