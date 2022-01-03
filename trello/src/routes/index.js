import React from 'react';
import BoardRoutes from "./BoardRoutes";
import AuthRoutes from "./AuthRoutes";
import AccountRoutes from "./AccountRoutes";

const Routes = () => {
    return (
        <>
            <AuthRoutes/>
            <AccountRoutes/>
            <BoardRoutes/>
        </>
    );
};
export default Routes;