"use client";
import React, { useState, ReactElement } from "react";
import NavDropdown from "@/partials/NavDropdown/NavDropdown";
import NavLink from "@/partials/NavLink/NavLink";
import Auth from "../Auth/Auth";
import styles from "./MainNav.module.scss";
import Link from "next/link";

/**
 * MainNav - The main navigation component of the application.
 * It utilizes Bootstrap classes for responsiveness and flexbox for alignment.
 */
export default function MainNav(): ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="d-flex justify-content-around bg-primary shadow navbar navbar-expand-md">
      <Link className="navbar-brand" href={"/"}>
        <img
          src="/images/deejPotterLogo.png"
          alt="The Deej Potter logo."
          height={64}
          width={64}
        />
      </Link>
      <nav className={` ${styles.navbar}`}>
        {/* Toggler button for smaller screens */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="oi oi-menu" />
        </button>

        {/* Collapsible menu items */}
        <div
          className={`${isCollapsed ? "collapse" : ""} navbar-collapse ${styles.navbarCollapse}`}
        >
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
          <NavLink href="/about" label="About" />
          <NavLink href="/contact" label="Contact" />
        </div>
      </nav>

      {/* Auth component aligned to the right */}
      <Auth />
    </div>
  );
}
