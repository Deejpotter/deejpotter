import { lightSection, lightSectionLeft, lightSectionRight } from "../styles/lightSection.module.css";

import Container from "./Container";
import React from "react";
import blueBlob from "../images/blueBlob.svg";
import greenBlob from "../images/greenBlob.svg";

function LightSectionBackground({ children, background }) {
    switch (background) {
        case "blueBlob":
            return (
                <section className={lightSection}>
                    <img src={blueBlob} alt="" className={lightSectionRight} />
                    <Container type="lightSection">
                        {children}
                    </Container>
                </section>
            );
        case "greenBlob":
            return (
                <section className={lightSection}>
                    <img src={greenBlob} alt="" className={lightSectionLeft} />
                    <Container type="lightSection">
                        {children}
                    </Container>
                </section>
            );

        default:
            return (
                <section className={lightSection}>
                    <Container type="lightSection">
                        {children}
                    </Container>
                </section>
            );
    }
}

export default LightSectionBackground;