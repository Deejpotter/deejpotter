import React from "react";

import { container } from "../styles/util.module.css";

function Container({ children }) {
    return (
        <div className={container}>
            {children}
        </div>
    );
}

export default Container;