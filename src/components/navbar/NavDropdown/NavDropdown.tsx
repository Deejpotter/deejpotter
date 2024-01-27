"use client";
import Link from 'next/link';
import React, { useState } from 'react';

// Define a type for the items in the dropdown menu.
export type NavDropdownItem = {
  id: string;
  href: string;
  label: string;
};

// Define a type for the props of the NavDropdown component.
export type NavDropdownProps = {
  title: string;
  items: NavDropdownItem[];
};

/**
 * NavDropdown component.
 * This is a reusable dropdown menu component for a navigation bar.
 * It receives a title and an array of items as props.
 * Each item is an object with a 'href', 'label', and 'id' property.
 *
 * @param {NavDropdownProps} props - The props for the component.
 * @returns {React.Element} The NavDropdown component.
 */
const NavDropdown: React.FC<NavDropdownProps> = ({ title, items }) => {
  // State to keep track of whether the dropdown is open or not.
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <li className="nav-item dropdown">
      <span
        className="nav-link dropdown-toggle"
        // Toggle the dropdown when the user clicks or hovers over it.
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
        // ARIA attributes for accessibility.
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        {title}
      </span>
      {/* Only display the dropdown menu if 'isDropdownOpen' is true. */}
      {isDropdownOpen && (
        <ul className="dropdown-menu" role="menu">
          {/* Map over the 'items' array and create a list item for each one. */}
          {items.map((item) => (
            <li key={item.id}>
              {/* Use the 'Link' component to create a link for each item. */}
              <Link href={item.href}>
                <span className="dropdown-item" role="menuitem">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavDropdown;