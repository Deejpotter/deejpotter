"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AuthButton from "@/components/ui/auth/AuthButton";
import NavDropdown from "./NavDropdown/NavDropdown";
import Image from "next/image";
import { useNavbar } from "@/contexts/NavbarContext";

const Navbar = () => {
  const { isNavCollapsed, navItems, closeAllDropdowns, toggleNavCollapse } =
    useNavbar();
  const [isLocalCollapsed, setIsLocalCollapsed] = useState(true);

  useEffect(() => {
    setIsLocalCollapsed(isNavCollapsed);
  }, [isNavCollapsed]);

  return (
    <nav className="border-b border-white/10 bg-gray-900 text-white shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/images/deejPotterLogo.svg"
            className="h-10 w-auto"
            alt="Deej Potter Logo"
            width={50}
            height={50}
          />
          <span className="hidden font-bold tracking-tight text-white sm:inline">Deej Potter</span>
        </Link>

        <button
          className="ml-auto inline-flex items-center justify-center rounded-xl border border-white/10 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 lg:hidden"
          type="button"
          onClick={toggleNavCollapse}
          aria-expanded={!isLocalCollapsed}
          aria-label="Toggle navigation"
        >
          <svg className={`${!isLocalCollapsed ? "hidden" : "block"} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <svg className={`${isLocalCollapsed ? "hidden" : "block"} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className={`${isLocalCollapsed ? "hidden" : "block"} lg:flex lg:flex-1 lg:items-center lg:justify-center`} id="navbarNav">
          <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
            {navItems.map((item, index) =>
              item.items ? (
                <NavDropdown key={index} label={item.label} items={item.items} />
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href || "#"}
                    className="block rounded-full px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10 hover:text-white"
                    onClick={() => {
                      closeAllDropdowns();
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="hidden lg:block">
          <AuthButton buttonSize="sm" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
