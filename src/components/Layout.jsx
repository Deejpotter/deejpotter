import * as React from 'react';

import "../styles/styles.css";
import Header from './Header';
import Footer from './Footer';

const Layout = ({ pageTitle, children }) => {
    return (
        <>
            <Header pageTitle={pageTitle} />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;