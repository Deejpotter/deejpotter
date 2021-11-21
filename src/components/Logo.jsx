import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { logo } from '../styles/header.module.css';

function Logo(props) {
    return (
        <StaticImage
            src="../images/DeejPotterLogoLightTrans.png"
            alt="The Deej Potter logo"
            loading="eager"
            placeholder="blurred"
            height="50"
        />
    );
}

export default Logo;