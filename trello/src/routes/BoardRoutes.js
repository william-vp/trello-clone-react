import React from 'react';
import Boards from "../components/app/Boards";
import Board from "../components/app/Boards/Board";
import AuthValidation from "./AuthValidation";

const BoardRoutes = () => {
    return (
        <>
            <AuthValidation path="/boards" component={Boards}/>
            <AuthValidation path="/board/:boardCode" component={Board}/>
        </>
    );
};
export default BoardRoutes;