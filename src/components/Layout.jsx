import * as React from 'react';

import "../styles/styles.css";
import Header from './Header';

const Layout = ({ pageTitle, children }) => {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
        </>
    );
};

export default Layout;