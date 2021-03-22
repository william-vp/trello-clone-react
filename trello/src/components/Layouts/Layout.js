import React from 'react';
import Navigation from "./Navigation";

const Layout = ({children}) => {
    return (
        <div>
            <Navigation/>
            <div className="m-0 p-0 w-100">
                {children}
            </div>
        </div>
    );
};
export default Layout;