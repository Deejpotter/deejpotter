import './globals.scss'
import {Fredoka, Nunito} from 'next/font/google'
import React from "react";
import {MainFooter} from "@/partials/MainFooter/MainFooter";
import MainNav from "@/partials/MainNav/MainNav";

const nunito = Nunito({
  subsets: ['latin'], variable: '--font-nunito'
})
const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka'
})

export const metadata = {
  title: 'Deej Potter', description: "Deej Potter's portfolio site.",
}

export default function RootLayout({children,}: {
  children: React.ReactNode
}) {
  return (<html lang="en" className={`${nunito.variable} ${fredoka.variable}`}>
  <body>

  <div className="page-container">
    <MainNav/>
    <div className="content-wrapper">
      <div className="route-animations-wrapper custom-scrollbar">
        {children}
      </div>
    </div>
    <MainFooter/>
  </div>
  </body>
  </html>)
}
