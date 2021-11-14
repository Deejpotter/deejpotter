import React from "react";

import Container from "./Container";

import { greenWave, greenBlob, greenPurpleBlobs } from "../styles/backgrounds.module.css";

function Hero({ children }) {
    return (
        <section className={greenPurpleBlobs}>
            <Container type="hero">
                {children}
            </Container>
        </section>
    );
}

export default Hero;