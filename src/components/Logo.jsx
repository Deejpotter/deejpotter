import DeejPotterLogoLightTrans from "../images/DeejPotterLogoLightTrans.svg";
import React from "react";
import { logo } from '../styles/header.module.css';

function Logo(props) {
    return (
        <img src={DeejPotterLogoLightTrans} alt="The Deej Potter logo" className={logo} />
    );
}

export default Logo;