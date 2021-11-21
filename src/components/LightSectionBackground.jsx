import Container from "./Container";
import React from "react";
import greenBlob from "../images/greenBlob.svg";
import { lightSection } from "../styles/lightSection.module.css";

function LightSectionBackground({ children, background }) {
    return (
        <section className={lightSection}>
            <img src={greenBlob} alt="" />
            <Container type="lightSection">
                {children}
            </Container>
        </section>
    );
}

export default LightSectionBackground;