import React, { useState } from "react";
import {
  menuButton,
  navLinkItem,
  navLinkText,
  navLinks,
  navLinksHidden
} from '../styles/header.module.css';

import { Link } from 'gatsby';

function Navigation(props) {

  const [linksClass, setlinksClass] = useState(navLinksHidden);

  function clickHandler() {
    if (linksClass === navLinks) {
      setlinksClass(navLinksHidden);
    } else {
      setlinksClass(navLinks);
    }
  }

  return (
    <nav>
      <button className={menuButton} onClick={() => clickHandler()}>Menu</button>
      <ul id="navLinks" className={linksClass}>
        <li className={navLinkItem}><Link to="/" className={navLinkText}>Home</Link></li>
        <li className={navLinkItem}><Link to="/about" className={navLinkText}>About</Link></li>
        <li className={navLinkItem}><Link to="/projects" className={navLinkText}>Projects</Link></li>
        <li className={navLinkItem}><Link to="/contact" className={navLinkText}>Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;