import React, {useContext, useEffect} from "react";
import {Route} from "react-router-dom";
import {Auth} from "../contexts/AuthContext";
import Loading from "../components/Layouts/Loading";
import {useHistory} from "react-router-dom";

const AuthValidation = ({component: Component, ...props}) => {
    const {user, loadingUser} = useContext(Auth);
    const history = useHistory();

    useEffect(() => {
        if (!sessionStorage.getItem("loggedIn")) history.push("/login");
        // eslint-disable-next-line
    }, [user]);
    
    if (!sessionStorage.getItem("loggedIn")) if (loadingUser) return <Loading/>;

    return (
        <Route {...props}
               render={() =>
                   <Component/>
               }
        />
    );
};
export default AuthValidation;
