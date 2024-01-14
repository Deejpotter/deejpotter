import "./globals.scss";
import { Fredoka, Nunito } from "next/font/google";
import React from "react";
import MainFooter from "@/partials/MainFooter/MainFooter";
import MainNav from "@/partials/MainNav/MainNav";
import { AuthProvider } from "@/contexts/AuthContext";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export const metadata = {
  title: "Deej Potter",
  description: "Deej Potter's portfolio site.",
  url: "https://deejpotter.com",
  image: "/images/deejPotterLogo.png",
};

// The RootLayout component is the root component that is used to wrap the pages.
// It takes the children prop which is the child components that will be wrapped by the context provider.
// The ReactNode type is a type that represents any valid React child element.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${fredoka.variable}`}>
			{/* The head element is built-in to Next.js and is used to provide metadata to the page.*/}
			{/* The AuthProvider component is used to provide the authentication context to the components. */}
      <AuthProvider>
        <body className="custom-scrollbar">
          <MainNav />
          <main>{children}</main>
          <MainFooter />
        </body>
      </AuthProvider>
    </html>
  );
}
