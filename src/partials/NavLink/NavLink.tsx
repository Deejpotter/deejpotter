import Link from 'next/link';
import {ReactElement} from "react";
import {NavLinkProps} from "@/partials/NavLink/NavLinkProps";

/**
 * A link to be used in the MainNav component.
 * @param href - The URL to link to as a next/link href.
 * @param label - The name of the link.
 */
export default function NavLink({href, label}: NavLinkProps): ReactElement {
  return (
    <Link href={href} className={`nav-link`}>
      {label}
    </Link>
  );
};

