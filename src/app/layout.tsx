import "@/styles/globals.css"; // Tailwind base & project utilities (migrated from SCSS)
import "./globals.scss"; // legacy SCSS (kept for gradual migration)
import { Viewport } from "next"; // Importing the Viewport type from Next.js
import { Fredoka, Nunito } from "next/font/google"; // Importing the Fredoka and Nunito fonts from the next/font/google module
import React from "react"; // Importing React
import MainFooter from "@/components/MainFooter/MainFooter";
import AuthProvider from "@/contexts/AuthProvider"; // Client component wrapper
import { NavbarProvider } from "@/contexts/NavbarContext";
import { ClerkProvider } from "@clerk/nextjs";
import BodyAttributesCleaner from "@/components/Client/BodyAttributesCleaner";
import TopNavbar from "@/components/TopNavbar/TopNavbar";
import { defaultMetadata } from "./metadata";

// Initializing the Nunito font with specific options
const nunito = Nunito({
  subsets: ["latin"], // Specifies the subsets of the font to load
  variable: "--font-nunito", // Specifies the CSS variable to assign the font to
});

// Initializing the Fredoka font with specific options
const fredoka = Fredoka({
  subsets: ["latin"], // Specifies the subsets of the font to load
  variable: "--font-fredoka", // Specifies the CSS variable to assign the font to
});

// Use centralized metadata configuration
export const metadata = defaultMetadata;

// The viewport data is passed to Next.js to set the viewport meta tag
export const viewport: Viewport = {
  themeColor: "#1E9952",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "dark",
};

// The RootLayout component is the root component that is used to wrap the pages.
// It takes the children prop which is the child components that will be wrapped by the context provider.
// The ReactNode type is a type that represents any valid React child element.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  const inner = (
    <AuthProvider>
      <NavbarProvider>
        <body
          suppressHydrationWarning
          className="custom-scrollbar bg-light text-dark dark:bg-dark dark:text-light"
        >
          {/* Client-only cleanup removes extension-injected attributes that break hydration */}
          <BodyAttributesCleaner />
          <div>
            <TopNavbar />
            <main className="w-full">
              {children}
              <MainFooter />
            </main>
          </div>
        </body>
      </NavbarProvider>
    </AuthProvider>
  );

  return (
    // The root HTML element with language set to English and classes for the fonts
    // Removed h-100 as min-h-screen on body is sufficient
    <html lang="en" className={`${nunito.variable} ${fredoka.variable}`}>
      {/* Only initialize Clerk in environments with a publishable key configured */}
      {hasClerk ? <ClerkProvider>{inner}</ClerkProvider> : inner}
    </html>
  );
}
