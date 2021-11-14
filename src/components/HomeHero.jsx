import React from "react";

import Container from "./Container";

import { greenWaveTopWide } from "../styles/backgrounds.module.css";

function Hero({ children }) {
    return (
        <section className={greenWaveTopWide}>
            <Container type="hero">
                {children}
            </Container>
        </section>
    );
}

export default Hero;