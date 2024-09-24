"use client";
import Link from 'next/link';
import React, { useState } from 'react';

// Define a type for the items in the dropdown menu.
// Updated to support nested items
export type NavDropdownItem = {
  href?: string;
  label: string;
  items?: NavDropdownItem[]; // New property for nested items
};

// Define a type for the props of the NavDropdown component.
export type NavDropdownProps = {
  title: string;
  items: NavDropdownItem[];
  depth?: number; // New prop to track nesting level
};

/**
 * NavDropdown component.
 * This component is used to create a dropdown menu in the navbar component.
 * Most of the styling is done using Bootstrap classes but I had to implement the dropdown functionality myself using React state instead of using Bootstrap's jQuery implementation.
 * This is because Next.js doesn't support jQuery out of the box. Also, I'm not that good with jQuery.
 * 
 * The component now supports nested dropdowns.
 *
 * @param {NavDropdownProps} props - The props for the component.
 * @returns {React.Element} The NavDropdown component.
 */
const NavDropdown: React.FC<NavDropdownProps> = ({ title, items, depth = 0 }) => {
  // State to keep track of whether the dropdown is open or not.
  // useState is a React hook that returns a state variable (in this case 'isDropdownOpen') and a function to update it (in this case 'setIsDropdownOpen').
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper functions to handle mouse events
  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  return (
    // nav-item and dropdown are Bootstrap classes that style the dropdown menu and are made to work with the other Bootstrap classes.
    // Added 'dropdown-submenu' class for nested dropdowns
    <li className={`nav-item dropdown ${depth > 0 ? 'dropdown-submenu' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
      <span
        // nav-link and dropdown-toggle are also built-in Bootstrap classes. nav-link styles the link and dropdown-toggle styles the dropdown toggle button.
        className="nav-link dropdown-toggle"
        // Toggle the dropdown when the user clicks or hovers over it.
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        // ARIA attributes for accessibility.
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        {title}
      </span>
      {/* Only display the dropdown menu if 'isDropdownOpen' is true. */}
      {isDropdownOpen && (
        // dropdown-menu is another built-in Bootstrap class that styles the dropdown menu.
        // show is a Bootstrap class that makes the dropdown menu visible when added with the dropdown-menu class.
        // Added 'dropdown-submenu' class for nested dropdowns
        <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""} ${depth > 0 ? 'dropdown-submenu' : ''}`}
            role="menu">
          {/* Map over the 'items' array and create a list item for each one. */}
          {items.map((item, index) => (
            item.items ? (
              // If the item has nested items, render another NavDropdown
              <NavDropdown
                key={index}
                title={item.label}
                items={item.items}
                depth={depth + 1}
              />
            ) : (
              // If it's a regular item, render a link
              <li key={index}>
                {/* Use the 'Link' component to create a link for each item. */}
                <Link className="dropdown-item" role="menuitem" href={item.href || '#'}>
                  {item.label}
                </Link>
              </li>
            )
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavDropdown;
