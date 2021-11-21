import Container from "./Container";
import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { lightSection } from "../styles/lightSection.module.css";

function LightSectionBackground({ children, background }) {
    return (
        <section className={lightSection}>
            <StaticImage src={background} alt="" />
            <Container type="lightSection">
                {children}
            </Container>
        </section>
    );
}

export default LightSectionBackground;