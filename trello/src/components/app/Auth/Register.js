import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Button, Form, Input, Typography} from "antd";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "../../Layouts/LanguageSwitcher";
import {Email as EmailIcon, Lock as LockIcon} from '@material-ui/icons';
import ThemeSwitcher from "../../Layouts/ThemeSwitcher";
import {useHistory} from 'react-router-dom'
import {app} from "../../../config/firebaseConfig";
import {openInfoLoading, openNotification} from "./Alert";

import logo from "../../../Logo-small.svg";
import {MotionScreen, SharedElement, useMotion, MotionScene} from "react-motion-layout";
import SocialButtons from "./SocialButtons";
import {Auth} from "../../../contexts/AuthContext";

const {Title, Text, Paragraph} = Typography

const Register = () => {
    const {user} = useContext(Auth);
    const history = useHistory()
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) history.push("/");
        // eslint-disable-next-line
    }, [history, user]);

    const withTransition = useMotion(`login`);
    // eslint-disable-next-line
    const callback = useCallback(() => history.push(`/login`));

    const {t} = useTranslation('auth')
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const {email, password} = form

    const submitRegister = async () => {
        openInfoLoading(true)
        setLoading(true)
        await app
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async result => {
                openInfoLoading(false)
                openNotification('success', 'Correcto', "Gracias por registrarte!!")
                history.push("/");
            })
            .catch(error => {
                console.log(error)
                openInfoLoading(false)
                let message;
                switch (error.code) {
                    case "auth/network-request-failed":
                        message = "Comprueba tu conexión a internet y vuelve a intentarlo"
                        break
                    case "auth/account-exists-with-different-credential":
                        message = "Una cuenta con el mismo correo ya existe. Probablemente ingresaste con otro método u otra red social"
                        break
                    case "auth/email-already-in-use":
                        message = "El correo electrónico ingresado ya esta en uso por otra cuenta"
                        break
                    case "auth/weak-password":
                        message = "La contraseña debe contener al menos 6 caracteres"
                        break
                    default:
                        message = "Ocurrio un error Inesperado. Intenta nuevamente"
                }
                openNotification('error', 'Error', message)
            });
        setLoading(false)
    };

    const onChange = (e) => {
        const field = e.target.name
        const value = e.target.value
        setForm({
            ...form, [field]: value
        })
    }

    return (
        <div className="container-fluid w-100 mt-0 pt-0 h-100">
            <div className="container mx-auto pt-lg-5 pt-md-5 p-sm-0 p-xs-0">
                <div className="row my-lg-3 my-md-5 my-sm-4">
                    <div className="col-lg-5 col-md-6 col-xs-12 mx-auto card-login p-5 my-auto border-sm">
                        <Paragraph>
                            <img src={logo} width={32} height={29} alt="LOGO"/>
                            <Text strong className="pl-2">Trello React</Text>
                        </Paragraph>

                        <MotionScreen>
                            <MotionScene name={`register`} scrollUpOnEnter>
                                <SharedElement.Text animationKey="register-title">
                                    <Title level={5} strong>{t('register_title')}</Title>
                                </SharedElement.Text>
                            </MotionScene>
                        </MotionScreen>

                        <Paragraph>
                            <Text>{t('register_message')}</Text>
                        </Paragraph>

                        <MotionScreen>
                            <Form className="mt-3"
                                  name="basic"
                                  initialValues={{email, password}}
                                  onFinish={submitRegister}>

                                <Form.Item
                                    className="my-3"
                                    name="email"
                                    rules={[{
                                        required: true,
                                        pattern: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: `${t('message_email')}`
                                    }]}>
                                    <Input
                                        name="email"
                                        onChange={onChange}
                                        placeholder={t('email_label')}
                                        prefix={<EmailIcon/>} size="large"/>
                                </Form.Item>

                                <Form.Item
                                    className="my-3"
                                    name="password"
                                    rules={[{
                                        required: true,
                                        min: 6,
                                        message: t('message_password')
                                    }]}>
                                    <Input.Password
                                        name="password"
                                        onChange={onChange}
                                        placeholder={t('password_label')}
                                        prefix={<LockIcon/>} size="large"/>
                                </Form.Item>

                                <Form.Item>
                                    <Button loading={loading} className="mt-3" type="primary" size="middle"
                                            htmlType="submit" block>
                                        {t('submit_register')}
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Paragraph className="text-center mt-4">
                                <Text>{t('continue_social')}</Text>
                            </Paragraph>
                            <Paragraph className="text-center">
                                <SocialButtons/>
                            </Paragraph>

                            <Paragraph className="text-center mt-4">
                                <MotionScene onClick={withTransition(callback)} name={`login`}>
                                    <SharedElement.Text animationKey="login-title">
                                        {t('message_already_account')}
                                        <Button type="link">{t('label_link_login')}</Button>
                                    </SharedElement.Text>
                                </MotionScene>
                            </Paragraph>
                        </MotionScreen>
                    </div>
                </div>
                <div className="row col-lg-5 col-md-6 col-xs-12 mx-auto mt-2">
                    <div className="col-6 text-left">
                        <Text>WilliamVP</Text>
                    </div>
                    <div className="col-6 text-right">
                        <Text>devchallenges.io</Text>
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
export default Register;