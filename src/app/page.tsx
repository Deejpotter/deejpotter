import { Metadata } from "next";
import { ReactElement } from "react";
import Home from "@/components/home/home";

export const metadata: Metadata = {
  alternates: { canonical: "https://deejpotter.com" },
};

export default function App(): ReactElement {
  return <Home />;
}
