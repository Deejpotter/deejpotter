import {ReactElement} from 'react';
import styles from './MainNav.module.scss';
import NavDropdown from "@/partials/NavDropdown/NavDropdown";
import NavLink from "@/partials/NavLink/NavLink";

/**
 * The main navigation component for the application.
 * Add NavLinks or NavDropdowns as needed.
 */
export default function MainNav(): ReactElement {
  return (<nav className={`navbar navbar-expand-lg navbar-light ${styles.navbar}`}>
    <NavDropdown
      btnLabel="Websites"
      indexHref={"/websites"}
      navLinks={[
        {href: "/websites/deejpotter", label: "Deejpotter"},
      ]}
    />
    <NavDropdown
      btnLabel="Apps"
      indexHref={"/apps"}
      navLinks={[
        {href: "/apps/todo-app", label: "Todo App"},
      ]}/>
    <NavLink href="/about" label="About"/>
    <NavLink href="/contact" label="Contact"/>
  </nav>);
};

