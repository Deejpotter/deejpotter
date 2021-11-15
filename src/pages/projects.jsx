import React from "react";

import Hero from "../components/Hero";
import Layout from "../components/Layout";

function AboutPage(props) {
    return (
        <Layout pageTitle="About me">
            <Hero>
                <h1>About me</h1>
                <p>This page is all about me. Keep reading to learn more.</p>
            </Hero>
        </Layout>
    );
}

export default AboutPage;