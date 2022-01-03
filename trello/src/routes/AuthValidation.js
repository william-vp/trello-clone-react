import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { Auth } from "../contexts/AuthContext";
import Loading from "../components/Layouts/Loading";
import { useHistory } from "react-router-dom";

const AuthValidation = ({ component: Component, ...props }) => {
  const { user, loadingAuth, loadingUser, profile } = useContext(Auth);
  const history = useHistory();

  useEffect(() => {
    if (!loadingUser && !user) history.push("/login");
    // eslint-disable-next-line
  }, [loadingUser, user]);

  if (loadingUser || loadingAuth) return <Loading />;

  return (
    <Route
      {...props}
      render={(props) =>
        !profile && !loadingUser ? <Redirect to={"/login"} /> : <Component />
      }
    ></Route>
  );
};
export default AuthValidation;
