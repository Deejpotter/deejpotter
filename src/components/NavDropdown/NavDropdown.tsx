"use client";
import React, { ReactElement, useState } from "react";
import styles from "./NavDropdown.module.scss";
import Link from "next/link";

/**
 * A dropdown menu to be used in the MainNav.
 * @param label - The name of the dropdown link.
 * @param indexHref - The href for the top level dropdown link.
 * @param navLinks - The NavLinks to be used in the dropdown as an array of NavLinkProps.
 */
export default function NavDropdown({
  btnLabel,
  indexHref,
  navLinks,
}: NavDropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div
      className={`${styles.navItem} ${isOpen ? styles.open : ""}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={toggleDropdown}
    >
      <Link
        href={indexHref}
        className={`${styles.navLink}`}
        id="dropdownMenuLink"
        aria-expanded={isOpen}
      >
        {btnLabel}
      </Link>
      {/* Uses a shortcut to conditionally render the dropdown menu.
      If isOpen is true, then render the div, otherwise render nothing. */}
      {isOpen && (
        <div
          className={`${styles.dropdownMenu}`}
          aria-labelledby="dropdownMenuLink"
        >
          {navLinks.map((route, index) => (
            <Link
              key={index}
              href={route.href}
              className={`${styles.dropdownItem}`}
            >
              {route.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export interface NavDropdownProps {
  btnLabel: string;
  indexHref: string;
  navLinks: DropdownItemProps[];
}

export interface DropdownItemProps {
  href: string;
  label: string;
}
