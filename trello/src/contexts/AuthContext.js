import React, {createContext, useEffect, useState} from "react";
import {app} from "../config/firebaseConfig";
import Loading from "../components/Layouts/Loading";
import axios from "../config/axios";
import tokenAuth from "../config/tokenAuth";
import {openNotification} from "../utils/alerts";

export const Auth = createContext();

export const AuthContext = ({children}) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({});
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);
    let timeOut= ''

    const getUser = async () => {
        if (!sessionStorage.getItem("loggedIn")) setLoadingAuth(true);
        await app.auth().onAuthStateChanged(async (user) => {
            if (user) {
                await app
                    .auth()
                    .currentUser.getIdToken(true)
                    .then((idToken) => {
                        localStorage.setItem("authToken", idToken);
                        setUser(user);
                        getProfile();
                    })
                    .catch(function () {
                        localStorage.removeItem("authToken");
                        setUser(null);
                    });
            } else {
                setLoadingAuth(false);
                localStorage.removeItem("authToken");
                setUser(null);
                return false;
            }
        });
        setLoadingAuth(false);
    };

    useEffect(() => {
        getUser();
        // eslint-disable-next-line
    }, []);

    const logOut = async () => {
        await app.auth().signOut();
        sessionStorage.removeItem('loggedIn');
        localStorage.removeItem("authToken");
        setUser(null)
        setProfile({})
    };

    const getProfile = async () => {
        if (!sessionStorage.getItem("loggedIn")) setLoadingUser(true);
        try {
            const token = localStorage.getItem("authToken");
            if (token) tokenAuth(token);
            const response = await axios.post(`/api/users/getUserAuth`);
            if (response.data.user) setProfile(response.data.user);
            sessionStorage.setItem('loggedIn', 'true');
            if (timeOut) clearTimeout(timeOut);
            timeOut= setTimeout(getUser, 1000 * 120);
        } catch (e) {
            setProfile(null);
            sessionStorage.setItem('loggedIn', false);
        }
        setLoadingUser(false);
    };

    const updateUser = async (data) => {
        setLoadingUser(true);
        try {
            const response = await axios.put(`/api/users`, data);
            if (response.data.user) {
                setProfile(response.data.user);
                openNotification("Correcto", "Datos actualizados", "success");
            }
        } catch (e) {
            openNotification("Error", e.response.message, "success");
        }
        setLoadingUser(false);
    };

    if (loadingAuth) {
        return <Loading/>;
    } else {
        return (
            <Auth.Provider
                value={{
                    user,
                    loadingAuth,
                    profile,
                    loadingUser,
                    logOut,
                    getProfile,
                    updateUser,
                    getUser,
                }}>
                {children}
            </Auth.Provider>
        );
    }
};
