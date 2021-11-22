import Container from "./Container";
import React from "react";
import { blackWaveBottom } from "../styles/backgrounds.module.css";

function Hero({ children }) {
    return (
        <section className={blackWaveBottom}>
            <Container type="hero">
                {children}
            </Container>
        </section>
    );
}

export default Hero;