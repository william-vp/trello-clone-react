import React from 'react';
import {Button, Result} from "antd";
import {Link} from "react-router-dom";

const Page403 = ({message = "No estas autorizado para ver esta página"}) => {
    return (
        <Result
            status="403"
            title="403"
            subTitle={`Disculpa. ${message}`}
            extra={<Link to={'/'}><Button type="primary">Volver al Inicio</Button></Link>}
        />
    );
};
export default Page403;