import * as React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

import Navigation from './Navigation';

import "../styles/styles.css";
import { container } from '../styles/util.module.css';

const Layout = ({ pageTitle, children }) => {
    return (
        <div className={container}>
            <title>{pageTitle}</title>
            <Navigation />
            <main>
                <h1>{pageTitle}</h1>
                {children}
            </main>
        </div>
    );
};

export default Layout;