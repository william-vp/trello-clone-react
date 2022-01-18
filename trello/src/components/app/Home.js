import React, {useContext, useEffect} from 'react';
import Layout from "../Layouts/Layout";
import {Auth} from "../../contexts/AuthContext";
import {useHistory} from "react-router-dom";

const Home = () => {
    const history = useHistory()
    const {user} = useContext(Auth);
    useEffect(() => {
        //if (user) history.push("/boards");
        // eslint-disable-next-line
    }, [history, user]);
    return (
        <Layout>
            <h1>Home</h1>
        </Layout>
    );
};
export default Home;