import Hero from "../components/Hero";
import Layout from "../components/Layout";
import React from "react";

function ContactPage(props) {
    return (
        <Layout pageTitle="Contact me">
            <Hero>
                <h1>Contact me</h1>
                <p>You can contact me on this page. Scroll down for more info.</p>
            </Hero>
        </Layout>
    );
}

export default ContactPage;