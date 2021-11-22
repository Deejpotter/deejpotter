import Hero from "../components/Hero";
import Layout from "../components/Layout";
import { Link } from "gatsby";
import React from "react";

function PageNotFound(props) {
    return (
        <Layout pageTitle="Page not found">
            <Hero>
                <h1>Page not found</h1>
                <Link to="/">Go back home</Link>
            </Hero>
        </Layout>
    );
}

export default PageNotFound;