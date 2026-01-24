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
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container">
        {/* The navbar brand is wrapped inside the Link so we can use client-side routing to navigate to the home page. */}
        <Link href="/">
          {/* The navbar brand is an image wrapped in a span to hold the navbar-brand class. */}
          <Image
            src="/images/deejPotterLogo.svg"
            className="navbar-brand"
            alt="Deej Potter Logo"
            width={50}
            height={50}
          />
        </Link>

        {/* Button to toggle the navbar on small screens. */}
        <button
          className="navbar-toggler" // This is a Bootstrap class that makes the button look like a hamburger icon.
          type="button" // The button type is set to show that it is used for interacting with the navbar rather than linking somewhere.
          onClick={toggleNavCollapse} // Set to call toggleNavCollapse on click
          aria-expanded={!isLocalCollapsed} // aria-expanded is an accessibility attribute that tells screen readers if the collapsible part of the navbar is expanded or collapsed
          aria-label="Toggle navigation" // aria-label is another attribute that labels the button for screen readers to give a description of what it does.
        >
          <span className="navbar-toggler-icon"></span>{" "}
          {/* The actual hamburger icon from Bootstrap */}
        </button>

        {/* Collapsible part of the navbar. Its visibility is controlled by isLocalCollapsed state. */}
        <div
          className={`${isLocalCollapsed ? "collapse" : ""} navbar-collapse`}
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {/* Navigation items, each wrapped in a Next.js Link for client-side routing */}
            {navItems.map((item, index) =>
              // If there are nested items, render a NavDropdown component.
              item.items ? (
                <NavDropdown
                  key={index}
                  label={item.label}
                  items={item.items}
                />
              ) : (
                // Otherwise, render a regular link.
                <li key={item.label} className="nav-item">
                  <Link href={item.href || "#"}>
                    <span
                      className="nav-link"
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
        <Auth />
      </div>
    </nav>
  );
};

export default Navbar;
