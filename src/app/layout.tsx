import "@/styles/globals.css"; // Tailwind base & project utilities (migrated from SCSS)
import { Metadata, Viewport } from "next"; // Importing the Metadata type from Next.js
import { Fredoka, Nunito } from "next/font/google"; // Importing the Fredoka and Nunito fonts from the next/font/google module
import React from "react"; // Importing React
import MainFooter from "@/components/MainFooter/MainFooter";
import Navbar from "@/components/Navbar/Navbar";
import AuthProvider from "@/contexts/AuthProvider"; // Client component wrapper
import BootstrapClient from "@/lib/BootstrapClient";
import { NavbarProvider } from "@/contexts/NavbarContext";
import { ClerkProvider } from "@clerk/nextjs";
import BodyAttributesCleaner from "@/components/Client/BodyAttributesCleaner";

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

// Defining the metadata for the website
export const metadata: Metadata = {
  metadataBase: new URL("https://deejpotter.com"), // The base URL of the website for absolute URLs.
  title: "Deej Potter", // The title of the website
  description: "Deej Potter's portfolio site.", // The description of the website for meta tags.
  openGraph: {
    title: "Deej Potter",
    description: "Deej Potter's portfolio site.",
    url: "https://deejpotter.com", // The URL of the website
    images: [
      {
        url: "/images/deejPotterLogo.png", // Must be an absolute URL.
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

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
        {/* The body of the HTML document with custom scrollbar class and Bootstrap classes for flexbox layout */}
        {/* 'd-flex flex-column h-100' creates a flex container that takes up the full height of the viewport */}
        <body suppressHydrationWarning className="custom-scrollbar d-flex flex-column h-100">
          {/* Client-only cleanup removes extension-injected attributes that break hydration */}
          <BodyAttributesCleaner />
          <Navbar />
          {/* The main content of the page, which will be the children passed to the RootLayout component */}
          {/* 'flex-grow-1' allows the main content to grow and push the footer down */}
          <main className="flex-grow-1">{children}</main>
          <BootstrapClient />
          {/* The Footer component */}
          <MainFooter />
        </body>
      </NavbarProvider>
    </AuthProvider>
  );

  return (
    // The root HTML element with language set to English and classes for the fonts
    // Added 'h-100' class to ensure the HTML element takes up the full viewport height
    <html lang="en" className={`${nunito.variable} ${fredoka.variable} h-100`}>
      {/* Only initialize Clerk in environments with a publishable key configured */}
      {hasClerk ? <ClerkProvider>{inner}</ClerkProvider> : inner}
    </html>
  );
}
