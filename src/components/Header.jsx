import { graphql, useStaticQuery } from "gatsby";

import Container from "./Container";
import Logo from './Logo';
import Navigation from './Navigation';
import React from "react";
import { header } from "../styles/header.module.css";

function Header({ pageTitle }) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          description
          title
        }
      }
    }
  `);
  return (
    <header className={header}>
      <Container type="nav">
        <title>{pageTitle} | {data.site.siteMetadata.title}</title>
        <Logo />
        <Navigation />
      </Container>
    </header>
  );
}

export default Header;