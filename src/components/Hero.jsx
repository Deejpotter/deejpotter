import React from "react";

import Container from "./Container";

function Hero({ children }) {
    return (
        <section>
            <Container>
                {children}
            </Container>
        </section>
    );
}

export default Hero;