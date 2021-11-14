import React from "react";

import Container from "./Container";
import Navigation from './Navigation';
import Logo from './Logo';

function Header({ pageTitle }) {
  return (
    <Container type="nav">
      <title>{pageTitle}</title>
      <Logo />
      <Navigation />
    </Container>
  );
}

export default Header;