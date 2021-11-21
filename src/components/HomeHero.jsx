import Container from "./Container";
import React from "react";
import { heroSection } from "../styles/hero.module.css";

function HomeHero({ children }) {
    return (
        <section className={heroSection}>
            <Container type="hero">
                {children}
            </Container>
        </section>
    );
}

export default HomeHero;