"use client";
import Link from "next/link"; // Next.js Link component for client-side routing
import React, { useState } from "react"; // We need React for this component because we are using hooks
import Auth from "./Auth"; // My custom Auth component
import NavDropdown from "./NavDropdown/NavDropdown"; // My custom NavDropdown component
import Image from "next/image";

const Navbar = () => {
  // State for managing the collapsed state of the navbar. Initially set to true (collapsed).
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  // Define the navigation structure
  const navItems = [
    {
      title: "Projects",
      items: [
        {
          label: "Apps",
          items: [
            { href: '/projects/apps/todo-app', label: 'Todo App' },
            // Add more links here.
          ]
        },
        {
          label: "Websites",
          items: [
            { href: '/projects/websites/deejpotter', label: 'Deej Potter' },
            // Add more links here.
          ]
        },
				{
					label: 'Engineering',
					items: [
            { href: '/projects/engineering/wireless-car', label: 'Wireless Car' },
            // Add more links here.
					]
				},
        {
          label: "Games",
          items: [
            { href: '/projects/games/basic-bases', label: 'Basic Bases' },
            // Add more links here.
          ]
        },
      ]
    },
    { href: '/about', label: 'About Me' },
    { href: '/contact', label: 'Contact Me' },
    // Add more top level links here.
  ];

  return (
    // Bootstrap's navbar component
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container">
        {/* The navbar brand is wrapped inside the Link so we can use client-side routing to navigate to the home page. */}
        <Link href="/">
          {/* The navbar brand is an image wrapped in a span to hold the navbar-brand class. */}
          <Image src="/images/deejPotterLogo.svg" className="navbar-brand" alt="Deej Potter Logo" width={50} height={50} />
        </Link>

        {/* Button to toggle the navbar on small screens. */}
        <button
          className="navbar-toggler" // This is a Bootstrap class that makes the button look like a hamburger icon.
          type="button" // The button type is set to show that it is used for interacting with the navbar rather than linking somewhere.
          onClick={() => setIsNavCollapsed(!isNavCollapsed)} // Set to call handleNavCollapse on click
          aria-expanded={!isNavCollapsed} // aria-expanded is an accessibility attribute that tells screen readers if the collapsible part of the navbar is expanded or collapsed
          aria-label="Toggle navigation" // aria-label is another attribute that labels the button for screen readers to give a description of what it does.
        >
          <span className="navbar-toggler-icon"></span> {/* The actual hamburger icon from Bootstrap */}
        </button>

        {/* Collapsible part of the navbar. Its visibility is controlled by isNavCollapsed state. */}
        <div
          className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {/* Navigation items, each wrapped in a Next.js Link for client-side routing */}
            {navItems.map((item, index) => 
              // If there are nested items, render a NavDropdown component.
              item.items ?
                (
                <NavDropdown key={index} title={item.title} items={item.items} />
                )
                // Otherwise, render a regular link.
                :
                (
                <li key={index} className="nav-item" onClick={() => setIsNavCollapsed(true)}>
                  <Link href={item.href || "#"}>
                    <span className="nav-link">{item.label}</span>
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
