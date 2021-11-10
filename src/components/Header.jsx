import React from "react";

import Navigation from './Navigation';
import { container } from "../styles/util.module.css";

function Header({ pageTitle }) {
  return (
    <div className={container}>
      <title>{pageTitle}</title>
      <Navigation />
    </div>
  );
}

export default Header;