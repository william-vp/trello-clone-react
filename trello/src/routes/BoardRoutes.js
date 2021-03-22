import React from 'react';
import Boards from "../components/app/Boards";
import Board from "../components/app/Boards/Board";
import AuthValidation from "./AuthValidation";
import { Route, Redirect } from "react-router-dom";

const BoardRoutes = () => {
    return (
        <>
            <AuthValidation path="/boards" component={Boards}/>
            <Route path="/board/:boardCode" component={Board}/>
        </>
    );
};
export default BoardRoutes;