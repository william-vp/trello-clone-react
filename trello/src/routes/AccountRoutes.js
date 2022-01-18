import React from 'react';
import Profile from "../components/app/Account/Profile";
import {Route} from "react-router-dom";
import Edit from "../components/app/Account/Edit";

const AuthRoutes = () => {
    return (
        <>
            <Route exact path="/profile" component={Profile}/>
            <Route exact path="/profile/edit" component={Edit}/>
        </>
    );
};
export default AuthRoutes;