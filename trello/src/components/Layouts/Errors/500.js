import React from 'react';
import {Button, Result} from "antd";
import {Link} from "react-router-dom";

const Page500 = ({message = "algo salió mal."}) => {
    return (
        <Result
            status="500"
            title="500"
            subTitle={`Disculpa, ${message}`}
            extra={<Link to={'/'}><Button type="primary">Volver al Inicio</Button></Link>}
        />
    );
};
export default Page500;