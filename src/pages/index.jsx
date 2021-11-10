import React from "react";
import { StaticImage } from "gatsby-plugin-image";

import Layout from "../components/Layout";
import Hero from "../components/Hero";
import { greenWave } from "../styles/backgrounds.module.css";

function HomePage() {
    return (
        <Layout pageTitle="Home Page">
            <Hero>
                <h1>Deej Potter</h1>
                <p>First part of the home page.</p>
            </Hero>
        </Layout>
    );
}

export default HomePage;