import type { ReactNode } from "react";
import { generatePageMetadata } from "@/app/metadata";

// The page is a client component, which can't export metadata, so it lives here.
export const metadata = generatePageMetadata(
  "Box Shipping Calculator",
  "Pack items into the fewest shipping boxes with a 3D bin packing calculator.",
  "/projects/tools/box-shipping-calculator"
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
