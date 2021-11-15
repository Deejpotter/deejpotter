import React from "react";

import Container from "./Container";
import Navigation from './Navigation';
import Logo from './Logo';
import { graphql, useStaticQuery } from "gatsby";

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
    <Container type="nav">
      <title>{pageTitle} | {data.site.siteMetadata.title}</title>
      <Logo />
      <Navigation />
    </Container>
  );
}

export default Header;