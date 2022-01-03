import React from 'react';
import ReactDOM from 'react-dom';
import './static/css/index.css';
//import * as serviceWorker from './serviceWorker';
import './config/i18next-config';
/*ROUTER*/
import {BrowserRouter as Router, Switch} from 'react-router-dom'
import {MotionLayoutProvider} from 'react-motion-layout';
import Routes from "./routes";
/*theme*/
import {ThemeSwitcherProvider} from "react-css-theme-switcher";
import {AuthContext} from "./contexts/AuthContext";

import {Provider} from 'react-redux';
import store from "./config/store";

const themes = {
    dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
    light: `${process.env.PUBLIC_URL}/light-theme.css`,
};
const defaultTheme = localStorage.getItem('theme')

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthContext>
                <ThemeSwitcherProvider
                    insertionPoint="styles-insertion-point"
                    themeMap={themes} defaultTheme={defaultTheme}>
                    <Router>
                        <MotionLayoutProvider>
                            <Switch>
                                <Routes/>
                            </Switch>
                        </MotionLayoutProvider>
                    </Router>
                </ThemeSwitcherProvider>
            </AuthContext>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
//serviceWorker.unregister();