import React from "react";
import { Link } from 'gatsby';
import {
  navLinks,
  navLinkItem,
  navLinkText
} from '../styles/header.module.css';

function Navigation(props) {
  return (
    <nav>
      <ul className={navLinks}>
        <li className={navLinkItem}><Link to="/" className={navLinkText}>Home</Link></li>
        <li className={navLinkItem}><Link to="/about" className={navLinkText}>About</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;