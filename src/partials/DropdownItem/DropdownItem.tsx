import styles from './DropdownItem.module.scss';
import Link from "next/link";

/**
 * A dropdown menu item to be used in the NavDropdown component.
 * @param href - The URL to link to as a next/link href.
 * @param label - The name of the link.
 */
export default function DropdownItem({href, label}: DropdownItemParams) {
  return <li className={`dropdown-item ${styles.dropdownItem}`}>
    <Link href={href}>
      {label}
    </Link>
  </li>;
}

export interface DropdownItemParams {
  href: string;
  label: string;
}
