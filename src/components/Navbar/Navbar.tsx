"use client";
import Link from "next/link"; // Next.js Link component for client-side routing
import React, { useEffect, useState } from "react"; // We need React for this component
import AuthButton from "@/components/ui/auth/AuthButton"; // Use AuthButton component
import NavDropdown from "./NavDropdown/NavDropdown"; // My custom NavDropdown component
import Image from "next/image";
import { useNavbar } from "@/contexts/NavbarContext";

const Navbar = () => {
  // Destructure the functions and state from the NavbarContext
  const { isNavCollapsed, navItems, closeAllDropdowns, toggleNavCollapse } =
    useNavbar();

  // Add local state for immediate visual feedback
  // Reference: https://react.dev/reference/react/useState
  const [isLocalCollapsed, setIsLocalCollapsed] = useState(true);

  // Use useEffect to sync local state with global state.
  // I wasn't seeing the dropdowns open and close as expected because the local state wasn't updating when the global state changed.
  // When I update the local state from the global state using useEffect, the dropdowns open and close as expected.
  // Reference: https://react.dev/reference/react/useEffect
  useEffect(() => {
    // Set the local state to the global state.
    setIsLocalCollapsed(isNavCollapsed);
  }, [isNavCollapsed]);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/deejPotterLogo.svg"
            className="h-10 w-auto"
            alt="Deej Potter Logo"
            width={50}
            height={50}
          />
        </Link>

        <button
          className="ml-auto lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          type="button"
          onClick={toggleNavCollapse}
          aria-expanded={!isLocalCollapsed}
          aria-label="Toggle navigation"
        >
          {/* Icon when menu is closed */}
          <svg
            className={`${!isLocalCollapsed ? "hidden" : "block"} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          {/* Icon when menu is open */}
          <svg
            className={`${isLocalCollapsed ? "hidden" : "block"} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div
          className={`${
            isLocalCollapsed ? "hidden" : "block"
          } lg:flex lg:items-center lg:w-auto w-full`}
          id="navbarNav"
        >
          <ul className="lg:flex items-center justify-center flex-1 space-x-4 text-sm">
            {navItems.map((item, index) =>
              item.items ? (
                <NavDropdown
                  key={index}
                  label={item.label}
                  items={item.items}
                />
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href || "#"}
                    className="block py-2 px-3 text-white rounded hover:bg-gray-700"
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

        <div className="hidden lg:block ml-4">
          <AuthButton buttonSize="sm" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
