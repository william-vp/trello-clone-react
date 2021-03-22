import React from "react";
import { Route } from "react-router-dom";
import Login from "../components/app/Auth/Login";
import Register from "../components/app/Auth/Register";

const AuthRoutes = () => {
  return (
    <>
      <Route exact path="/" component={Login} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
    </>
  );
};
export default AuthRoutes;
