import React, {useCallback, useContext, useEffect, useState} from "react";
import {Button, Form, Input, Typography} from "antd";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "../../Layouts/LanguageSwitcher";
import {Email as EmailIcon, Lock as LockIcon} from "@material-ui/icons";
import ThemeSwitcher from "../../Layouts/ThemeSwitcher";
import {useHistory} from "react-router-dom";
import {app} from "../../../config/firebaseConfig";
import {openInfoLoading, openNotification} from "./Alert";
import {Auth} from "../../../contexts/AuthContext";

import logo from "../../../Logo-small.svg";
import {
    MotionScene,
    MotionScreen,
    SharedElement,
    useMotion,
} from "react-motion-layout";
import SocialButtons from "./SocialButtons";

const {Title, Text, Paragraph, Link} = Typography;

const Login = () => {
    const {user} = useContext(Auth);
    const history = useHistory();
    let token= sessionStorage.getItem("loggedIn")

    useEffect(() => {
        if (token) {
            console.log("redirecting to boards");
            history.push("/boards");
        }
        // eslint-disable-next-line
    }, [token, user]);

    const withTransition = useMotion(`register`);
    // eslint-disable-next-line
    const callback = useCallback(() => history.push(`/register`));

    const {t} = useTranslation("auth");
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const {email, password} = form;

    const submitLogin = async () => {
        openInfoLoading(true);
        await app
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result);
                openInfoLoading(false);
                openNotification("success", "Correcto", "Inicio de sesión exitoso. Espere un momento por favor");
                return history.push("/boards");
            })
            .catch((error) => {
                console.log(error.code);
                openInfoLoading(false);
                let message;
                switch (error.code) {
                    case "auth/network-request-failed":
                        message = "Comprueba tu conexión a internet y vuelve a intentarlo";
                        break;
                    case "auth/invalid-email":
                        message = "Ingresa un correo válido por favor";
                        break;
                    case "auth/wrong-password":
                        message = "Contraseña Incorrecta";
                        break;
                    case "auth/user-not-found":
                        message = "El correo digitado no esta asociado a ninguna cuenta";
                        break;
                    default:
                        message = "Ocurrio un error Inesperado. Intenta nuevamente";
                }
                openNotification("error", "Error", message);
            });
    };

    const onChange = (e) => {
        const field = e.target.name;
        const value = e.target.value;
        setForm({
            ...form,
            [field]: value,
        });
    };

    return (
        <div className="container-fluid w-100 mt-0 pt-0 h-100">
            <div className="container mx-auto pt-lg-5 pt-md-5 p-sm-0 p-xs-0">
                <div className="row my-lg-3 my-md-5 my-sm-4">
                    <div className="col-lg-5 col-md-6 col-xs-12 mx-auto card-login p-5 my-auto border-sm">
                        <Paragraph>
                            <img src={logo} width={32} height={29} alt="LOGO"/>
                            <Text strong className="pl-2">
                                Thullo
                            </Text>
                        </Paragraph>

                        <MotionScreen>
                            <MotionScene name={`login`} scrollUpOnEnter>
                                <SharedElement.Text animationKey="login-title">
                                    <Title className="mt-5" level={4}>
                                        {t("login_title")}
                                    </Title>
                                </SharedElement.Text>
                            </MotionScene>
                        </MotionScreen>

                        <Form
                            className="mt-4"
                            name="basic"
                            initialValues={{email, password}}
                            onFinish={submitLogin}
                        >
                            <Form.Item
                                className="my-3"
                                name="email"
                                rules={[{required: true, message: `${t("message_email")}`}]}
                            >
                                <Input
                                    name="email"
                                    onChange={onChange}
                                    placeholder={t("email_label")}
                                    prefix={<EmailIcon/>}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                className="my-3"
                                name="password"
                                rules={[{required: true, message: t("message_password")}]}
                            >
                                <Input.Password
                                    name="password"
                                    onChange={onChange}
                                    placeholder={t("password_label")}
                                    prefix={<LockIcon/>}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    className="mt-3"
                                    type="primary"
                                    size="middle"
                                    htmlType="submit"
                                    block
                                >
                                    {t("submit_login")}
                                </Button>
                            </Form.Item>
                        </Form>

                        <Paragraph className="text-center mt-4">
                            <Text>{t("continue_social")}</Text>
                        </Paragraph>
                        <Paragraph className="text-center">
                            <SocialButtons/>
                        </Paragraph>

                        <Paragraph>
                            <MotionScreen>
                                <MotionScene
                                    onClick={withTransition(callback)}
                                    name={`register`}
                                >
                                    <SharedElement.Text animationKey="register-title">
                                        {t("message_not_account")}
                                        <Button type="link">{t("label_link_register")}</Button>
                                    </SharedElement.Text>
                                </MotionScene>
                            </MotionScreen>
                        </Paragraph>
                    </div>
                </div>
                <div className="row col-lg-5 col-md-6 col-xs-12 mx-auto mt-2">
                    <div className="col-6 text-left">
                        <Link href="https://www.linkedin.com/in/william-vp-a6785b181/">WilliamVP</Link>
                    </div>
                    <div className="col-6 text-right">
                        <Link href="https://devchallenges.io/">devchallenges.io</Link>
                    </div>
                </div>
                <div className="row col-lg-5 col-md-6 col-xs-12 mx-auto mt-2">
                    <div className="col-6 text-left">
                        <LanguageSwitcher/>
                    </div>
                    <div className="col-6 text-right">
                        <ThemeSwitcher/>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
