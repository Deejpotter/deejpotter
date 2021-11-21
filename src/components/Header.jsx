import { graphql, useStaticQuery } from "gatsby";

import Container from "./Container";
import Logo from './Logo';
import Navigation from './Navigation';
import React from "react";

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