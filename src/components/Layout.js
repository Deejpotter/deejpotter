import * as React from 'react';
import "../styles/styles.css";
import {
    container
} from '../styles/layout.module.css';
import Navigation from './Navigation';

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