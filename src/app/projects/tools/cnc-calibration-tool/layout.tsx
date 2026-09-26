import type { ReactNode } from "react";
import { generatePageMetadata } from "@/app/metadata";

// The page is a client component, which can't export metadata, so it lives here.
export const metadata = generatePageMetadata(
  "CNC Calibration Tool",
  "Work out steps per mm and flow compensation for CNC machines and 3D printers.",
  "/projects/tools/cnc-calibration-tool"
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
