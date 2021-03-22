import React, {useContext, useEffect} from 'react';
import Boards from "./components/app/Boards";
import {Auth} from "./contexts/AuthContext";
import Loading from "./components/Layouts/Loading";

function App() {
    const {profile, user, loadingUser} = useContext(Auth);

    useEffect(() => {
        if (loadingUser) return <Loading/>
        if (!profile && !user) history.push("/boards");
        // eslint-disable-next-line
    }, [profile, user]);

    return (
        <div className="App">
            <Boards/>
        </div>
    );
}

export default App;