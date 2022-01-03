import React from 'react';
import {Button, Result} from "antd";
import {Link} from "react-router-dom";

const Page404 = ({message = "la página que estas buscando no existe."}) => {
    return (
        <Result
            status="404"
            title="404"
            subTitle={`Disculpa, ${message}`}
            extra={<Link to={'/'}><Button type="primary">Volver al Inicio</Button></Link>}
        />
    );
};
export default Page404;