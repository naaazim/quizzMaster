import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, title }) => {
    return (
        <div className="app-layout">
            <Navbar title={title} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
