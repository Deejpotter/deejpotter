"use client";
import Link from 'next/link';
import React, { useState } from 'react';

// Define a type for the items in the dropdown menu.
export type NavDropdownItem = {
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
 * This component is used to create a dropdown menu in the navbar component.
 * Most of the styling is done using Bootstrap classes but I had to implement the dropdown functionality myself using React state instead of using Bootstrap's jQuery implementation.
 * This ta
 *
 * @param {NavDropdownProps} props - The props for the component.
 * @returns {React.Element} The NavDropdown component.
 */
const NavDropdown: React.FC<NavDropdownProps> = ({ title, items }) => {
  // State to keep track of whether the dropdown is open or not.
  // useState is a React hook that returns a state variable (in this case 'isDropdownOpen') and a function to update it (in this case 'setIsDropdownOpen').
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    // nav-item and dropdown are Bootstrap classes that style the dropdown menu and are made to work with the other Bootstrap classes.
    <li className="nav-item dropdown">
      <span
        // nav-link and dropdown-toggle are also built-in Bootstrap classes. nav-link styles the link and dropdown-toggle styles the dropdown toggle button.
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
        // dropdown-menu is another built-in Bootstrap class that styles the dropdown menu.
        // show is a Bootstrap class that makes the dropdown menu visible when added with the dropdown-menu class.
        <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
          role="menu" 
        // Toggle the dropdown when the user clicks or hovers over it.
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}>
          {/* Map over the 'items' array and create a list item for each one. */}
          {items.map((item, index) => (
            <li key={index.toString()}>
              {/* Use the 'Link' component to create a link for each item. */}
              <Link className="dropdown-item" role="menuitem" href={item.href}>
                {item.label} 
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavDropdown;