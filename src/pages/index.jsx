import HomeHero from "../components/HomeHero";
import Layout from "../components/Layout";
import LightSectionBackground from "../components/LightSectionBackground";
import { Link } from "gatsby";
import React from "react";

function HomePage() {
    return (
        <Layout pageTitle="Home Page">
            <HomeHero>
                <h1>Deej Potter</h1>
                <p>I make nice websites. I can make one for you too.</p>
                <p><b>Interested?</b></p>
                <Link to="/contact">Contact me</Link>
            </HomeHero>
            <LightSectionBackground background="greenBlob.svg">
                <h2>Check out my work</h2>
                <p>Want to see what I can do? Check out the projects I've worked on.</p>
                <Link to="/projects">See my projects</Link>
            </LightSectionBackground>
        </Layout>
    );
}

export default HomePage;