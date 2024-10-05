"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useNavbar } from "@/contexts/NavbarContext";
import { NavItem } from "@/contexts/NavbarContext";

// Define a type for the props of the NavDropdown component.
export type NavDropdownProps = {
  label: string;
  items: NavItem[];
  depth?: number; // Prop to track nesting level
};

/**
 * NavDropdown component.
 * This component is used to create a dropdown menu in the navbar component.
 * Most of the styling is done using Bootstrap classes but I had to implement the dropdown functionality myself using React state instead of using Bootstrap's jQuery implementation.
 * This is because Next.js doesn't support jQuery out of the box. Also, I'm not that good with jQuery.
 *
 * The component now supports nested dropdowns and uses a context for state management.
 *
 * @param {NavDropdownProps} props - The props for the component.
 * @returns {React.Element} The NavDropdown component.
 */
const NavDropdown: React.FC<NavDropdownProps> = ({
  label,
  items,
  depth = 0,
}) => {
  // First, destructure the state and functions from the NavbarContext.
  const { openDropdowns, toggleDropdown, closeAllDropdowns } = useNavbar();

  // Add local state for immediate visual feedback
  // Reference: https://react.dev/reference/react/useState
  const [isLocalOpen, setIsLocalOpen] = useState(false);

  // Use useEffect to sync local state with global state.
  // I wasn't seeing the dropdowns open and close as expected because the local state wasn't updating when the global state changed.
  // When I update the local state from the global state using useEffect, the dropdowns open and close as expected.
  // Reference: https://react.dev/reference/react/useEffect
  useEffect(() => {
    setIsLocalOpen(openDropdowns.includes(label));
  }, [openDropdowns, label]);

  // Helper functions.
  // Handle the click event to toggle the current dropdown.
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    toggleDropdown(label); // Toggle the dropdown using the toggleDropdown function from the context then the useEffect above will update the local state.
  };
  // Handle mouse enter and leave events to show and hide the current dropdown.
  const handleMouseEnter = () => {
    setIsLocalOpen(true);
  };
  const handleMouseLeave = () => {
    setIsLocalOpen(false);
  };

  return (
    // nav-item and dropdown are Bootstrap classes that style the dropdown menu and are made to work with the other Bootstrap classes.
    // Added 'dropdown-submenu' class for nested dropdowns
    <li
      className={`nav-item dropdown ${depth > 0 ? "dropdown-submenu" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        // nav-link and dropdown-toggle are also built-in Bootstrap classes. nav-link styles the link and dropdown-toggle styles the dropdown toggle button.
        className="nav-link dropdown-toggle"
        // Toggle the dropdown when the user clicks.
        onClick={handleClick}
        // ARIA attributes for accessibility.
        aria-haspopup="true"
        aria-expanded={isLocalOpen}
      >
        {label}
      </span>
      {/* Only display the dropdown menu if 'isLocalOpen' is true. */}
      {isLocalOpen && (
        // dropdown-menu is another built-in Bootstrap class that styles the dropdown menu.
        // show is a Bootstrap class that makes the dropdown menu visible when added with the dropdown-menu class.
        // Added 'dropdown-submenu' class for nested dropdowns
        <ul
          className={`dropdown-menu ${isLocalOpen ? "show" : ""} ${
            depth > 0 ? "dropdown-submenu" : ""
          }`}
          role="menu"
        >
          {/* Map over the 'items' array and create a list item for each one. */}
          {items.map((item) =>
            item.items ? (
              // If the item has nested items, render another NavDropdown
              <NavDropdown
                key={`${label}-${item.label}`}
                label={item.label}
                items={item.items}
                depth={depth + 1}
              />
            ) : (
              // If it's a regular item, render a link
              <li key={`${label}-${item.label}`}>
                {/* Use the 'Link' component to create a link for each item. */}
                <Link
                  className="dropdown-item"
                  role="menuitem"
                  href={item.href || "#"}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation(); // Prevent event bubbling
                    // Close all dropdowns when a link is clicked using the closeAllDropdowns function from the context.
                    closeAllDropdowns();
                  }}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      )}
    </li>
  );
};

export default NavDropdown;
