import { container, containerCenterAlign } from "../styles/util.module.css";

import React from "react";
import { containerHero } from "../styles/hero.module.css";
import { containerLightSection } from "../styles/lightSection.module.css";
import { containerNav } from "../styles/header.module.css";

function Container({ children, type }) {
    switch (type) {
        case "center":
            return (
                <div className={containerCenterAlign}>
                    {children}
                </div>
            );

        case "nav":
            return (
                <div className={containerNav}>
                    {children}
                </div>
            );

        case "hero":
            return (
                <div className={containerHero}>
                    {children}
                </div>
            );
        case "lightSection":
            return (
                <div className={containerLightSection}>
                    {children}
                </div>
            );

        default:
            return (
                <div className={container}>
                    {children}
                </div>
            );
    }
}

export default Container;