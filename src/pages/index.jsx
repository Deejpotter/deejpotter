import React from "react";

import Layout from "../components/Layout";
import HomeHero from "../components/HomeHero";

function HomePage() {
    return (
        <Layout pageTitle="Home Page">
            <HomeHero>
                <h1>Deej Potter</h1>
                <p>I make nice websites. I can make one for you too.</p>
                <p><b>Interested?</b></p>
                <a href="/contact">Contact me</a>
            </HomeHero>
            <section>

            </section>
        </Layout>
    );
}

export default HomePage;