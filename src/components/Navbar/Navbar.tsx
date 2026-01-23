"use client";
import Link from "next/link"; // Next.js Link component for client-side routing
import React, { useEffect, useState } from "react"; // We need React for this component
import Auth from "./Auth"; // My custom Auth component
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
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/deejPotterLogo.svg"
            className="navbar-brand"
            alt="Deej Potter Logo"
            width={50}
            height={50}
          />
        </Link>

        <button
          className="navbar-toggler ml-auto lg:hidden"
          type="button"
          onClick={toggleNavCollapse}
          aria-expanded={!isLocalCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isLocalCollapsed ? "hidden" : "flex"} navbar-collapse flex-1 justify-center lg:flex`} id="navbarNav">
          <ul className="flex space-x-4 items-center">
            {navItems.map((item, index) =>
              item.items ? (
                <NavDropdown key={index} label={item.label} items={item.items} />
              ) : (
                <li key={item.label} className="nav-item">
                  <Link href={item.href || "#"}>
                    <span
                      className="nav-link cursor-pointer"
                      onClick={() => {
                        closeAllDropdowns();
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="ml-auto">
          <Auth />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
