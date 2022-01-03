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

    const getUser = async () => {
        setLoadingAuth(true);
        await app.auth().onAuthStateChanged(async (user) => {
            if (user) {
                await app
                    .auth()
                    .currentUser.getIdToken(true)
                    .then((idToken) => {
                        localStorage.setItem("authToken", idToken);
                        console.log(idToken);
                        setUser(user);
                        getProfile();
                    })
                    .catch(function (error) {
                        console.log(error);
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
        localStorage.removeItem("authToken");
        await app.auth().signOut();
    };

    const getProfile = async () => {
        setLoadingUser(true);
        try {
            const token = localStorage.getItem("authToken");
            if (token) tokenAuth(token);
            const response = await axios.post(`/api/users/getUserAuth`);
            if (response.data.user) setProfile(response.data.user);
        } catch (e) {
            setProfile(null);
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
                }}
            >
                {children}
            </Auth.Provider>
        );
    }
};
