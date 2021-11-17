import Hero from "../components/Hero";
import Layout from "../components/Layout";
import React from "react";

function ProjectsPage(props) {
    return (
        <Layout pageTitle="My projects">
            <Hero>
                <h1>My projects</h1>
                <p>This is where I show off the projects that I've made.<br />Scroll down to see more of my stuff.</p>
            </Hero>
        </Layout>
    );
}

export default ProjectsPage;