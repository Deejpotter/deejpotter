"use client";
import React, { useState, ReactElement } from "react";
import NavDropdown from "@/partials/NavDropdown/NavDropdown";
import Auth from "../Auth/Auth";
import styles from "./MainNav.module.scss";
import Link from "next/link";

/**
 * MainNav - The main navigation component of the application.
 * It utilizes Bootstrap classes for responsiveness and flexbox for alignment.
 */
export default function MainNav(): ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Outer navbar container */}
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        {/* Inner navbar container */}
        <div className="container-fluid">
          {/* Link with brand image */}
          <Link className={`${styles.navbarBrand}`} href={"/"}>
            <img src="/images/deejPotterLogo.png" alt="The Deej Potter logo." />
          </Link>

          {/* Toggler button for smaller screens */}
          <button
            className={`navbar-toggler ${isCollapsed ? "" : "collapsed"}`}
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible menu items */}
          <div className={`${isCollapsed ? "collapse" : ""} navbar-collapse`}>
            <NavDropdown
              btnLabel="Websites"
              indexHref="/websites"
              navLinks={[{ href: "/websites/deejpotter", label: "Deejpotter" }]}
            />
            <NavDropdown
              btnLabel="Apps"
              indexHref="/apps"
              navLinks={[{ href: "/apps/todo-app", label: "Todo App" }]}
            />
            <Link href={"/about"} className={`nav-link`}>
              About
            </Link>
            <Link href={"/contact"} className={`nav-link`}>
              Contact
            </Link>
          </div>

          {/* Auth component aligned to the right */}
          <Auth />
        </div>
      </nav>
    </>
  );
}
