import React from "react";
import Page403 from "../components/Layouts/Errors/403";
import Page404 from "../components/Layouts/Errors/404";
import Page500 from "../components/Layouts/Errors/500";
import {openMessageInfo, openNotification} from "../utils/alerts";

export const manage_errors = (e, show = false, type) => {
    let code, message, details
    //let status = e.response.status ? e.response.status : 0;
    code = e.response.data.code ? e.response.data.code : '';
    details = e.response.data.details ? e.response.data.details : '';
    message = e.response.data.msg ? e.response.data.msg : e.response.data.message;

    const msg = message ? message : "Ocurrió un error inesperado. Intenta nuevamente"
    if (show) {
        if (type === "notification") {
            openNotification('Error', msg, "error")
        } else {
            openMessageInfo('error', msg)
        }
    }

    if (process.env.REACT_APP_DEBUG) {
        console.log("error code")
        console.log(code)
        console.log("Details")
        console.log(details)
        console.log(e)
    }
};

export const show_page_error = (error) => {
    const {status, msg} = error
    let message = msg ? msg : "";
    switch (status) {
        case 403:
            return <Page403 message={message}/>;
        case 404:
            return <Page404 message={message}/>;
        case 505:
            return <Page500 message={message}/>;
        default:
            openMessageInfo('error', message)
    }
}
