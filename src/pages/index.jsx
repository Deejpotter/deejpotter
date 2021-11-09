import React from "react";
import { StaticImage } from "gatsby-plugin-image";

import Layout from "../components/Layout";

function HomePage(props) {
    return (
        <Layout pageTitle="Home Page">
            <p>First part of the home page.</p>
            <StaticImage src="../images/wave.svg" alt="A blob." objectFit="cover" />
        </Layout>
    );
}

export default HomePage;