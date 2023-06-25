'use client';
import React, {ReactElement, useState} from 'react';
import styles from './NavDropdown.module.scss';
import Link from "next/link";
import DropdownItem from "@/partials/DropdownItem/DropdownItem";
import {NavLinkProps} from "@/partials/NavLink/NavLinkProps";

/**
 * A dropdown menu to be used in the MainNav.
 * @param label - The name of the dropdown link.
 * @param indexHref - The href for the top level dropdown link.
 * @param navLinks - The NavLinks to be used in the dropdown as an array of NavLinkProps.
 */
export default function NavDropdown({btnLabel, indexHref, navLinks}: NavDropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <li
      className={`nav-item dropdown ${styles.navDropdown}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={indexHref} className={`nav-link dropdown-toggle`}
            id="navbarDropdown"
            data-bs-toggle="dropdown"
            aria-expanded={isOpen}
      >
        {btnLabel}
      </Link>
      {isOpen && (
        <ul className={`dropdown-menu ${styles.dropdownMenu}`} aria-labelledby="navbarDropdown">
          {navLinks.map((route, index) => (
            <DropdownItem key={index} href={route.href} label={route.label}/>
          ))}
        </ul>
      )}
    </li>
  );
}

export interface NavDropdownProps {
  btnLabel: string;
  indexHref: string;
  navLinks: NavLinkProps[];
}
