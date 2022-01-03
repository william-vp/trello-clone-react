import React, {useContext, useEffect, useState} from 'react';
import Layout from "../../Layouts/Layout";
import {Button, Card, Form, Input, Space, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {Auth} from "../../../contexts/AuthContext";
import Loading from "../../Layouts/Loading";

import {Link} from "react-router-dom";
import {LeftOutlined} from '@ant-design/icons';
import AvatarUpload from "./AvatarUpload";

const {Text, Title} = Typography

const Edit = () => {
    const {t} = useTranslation(['auth', 'app'])
    const {profile, loadingUser, updateUser,} = useContext(Auth);

    const [form, setForm] = useState(profile);

    useEffect(() => {
        if (profile.email) setForm(profile)
    }, [profile]);

    const {name, email, photoUrl, phoneNumber, bio} = form

    const onChange = (e) => {
        const field = e.target.name
        const value = e.target.value
        setForm({
            ...form, [field]: value
        })
    }

    const submitForm = () => {
        updateUser(form)
    }

    if (loadingUser) return <Loading/>
    if (!profile.email) return "null"

    return (
        <Layout>
            <div className="container-fluid w-100 bg-container-gray my-0 py-0">
                <div className="container mx-auto pt-lg-3 pt-md-4 pt-xs-3">
                    <div className="row my-md-5 my-sm-4 h-100 my-auto p-0">
                        <div className="col-lg-8 col-xs-12 text-left mx-auto back-button-profile">
                            <Link to={"/profile"}><LeftOutlined/> {t('app:back')}</Link>
                        </div>
                        <div className="col-lg-8 col-xs-12 mx-auto mb-5 pt-lg-4">
                            <Form
                                name="edit_profile"
                                initialValues={{name, email, bio, phoneNumber}}
                                onFinish={submitForm}>
                                <Card
                                    bodyStyle={{paddingLeft: 0, paddingRight: 0}}
                                    className="card-profile w-100 bg-transparent mb-5">
                                    <div className="row py-1 pl-lg-5 px-sm-3">
                                        <div className="col-12">
                                            <Title level={4}>{t('change_info_title')}</Title>
                                            <Text type="secondary">{t('change_info_desc')}</Text>
                                        </div>
                                    </div>
                                    <div className="row py-1 pl-lg-5 px-sm-3">
                                        <div className="col-12 mt-3">
                                            <Space size="large">
                                                <AvatarUpload src={photoUrl}/>
                                                <Text className="label-form" type="secondary">{t('change_photo')}</Text>
                                            </Space>
                                        </div>
                                    </div>
                                    <div className="row py-1 pl-lg-5 px-sm-3 b-0 mt-3">
                                        <div className="col-lg-8 col-xs-12">
                                            <Text className="label-form" strong>{t('label_name')}</Text>

                                            <Form.Item
                                                className="mb-3"
                                                required
                                                rules={[{
                                                    required: true,
                                                    message: `${t('message_input')} ${t('label_name')}`
                                                }]}>
                                                <Input
                                                    value={name}
                                                    onChange={onChange}
                                                    name="name"
                                                    className="input-profile"
                                                    placeholder={`${t('placeholder_input')} ${t('label_name')}`}/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="row py-1 pl-lg-5 px-sm-3 pb-0">
                                        <div className="col-lg-8 col-xs-12">
                                            <Text className="label-form" strong>{t('label_bio')}</Text>
                                            <Input.TextArea
                                                value={bio}
                                                onChange={onChange}
                                                name="bio"
                                                className="textarea-profile mb-3"
                                                placeholder={`${t('placeholder_input')} ${t('label_bio')}`}/>
                                        </div>
                                    </div>
                                    <div className="row py-1 pl-lg-5 px-sm-3">
                                        <div className="col-lg-8 col-xs-12">
                                            <Text className="label-form" strong>{t('label_phone')}</Text>
                                            <Input
                                                value={phoneNumber}
                                                onChange={onChange}
                                                name="phoneNumber"
                                                className="input-profile mb-3"
                                                placeholder={`${t('placeholder_input')} ${t('label_phone')}`}/>
                                        </div>
                                    </div>
                                    <div className="row py-1 pl-lg-5 px-sm-3">
                                        <div className="col-lg-8 col-xs-12">
                                            <Text className="label-form" strong>{t('email_label')}</Text>
                                            <Form.Item
                                                className="mb-3"
                                                required
                                                rules={[{
                                                    message: `${t('message_input')} ${t('email_label')}`
                                                }]}>
                                                <Input
                                                    disabled
                                                    value={email}
                                                    onChange={onChange}
                                                    name="email"
                                                    className="input-profile"
                                                    placeholder={`${t('placeholder_input')} ${t('email_label')}`}/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="row py-1 pl-lg-5 px-sm-3">
                                        <div className="col-lg-8 col-xs-12">
                                            <Text className="label-form" strong>{t('password_label')}</Text>
                                            <Form.Item
                                                className="mb-3"
                                                rules={[{
                                                    message: `${t('message_input')} ${t('password_label')}`
                                                }]}>
                                                <Input.Password
                                                    onChange={onChange}
                                                    name="password"
                                                    //style={{background: 'transparent'}}
                                                    className="input-profile"
                                                    placeholder={`${t('placeholder_input')} ${t('password_label')}`}/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="row py-1 pl-lg-5 px-sm-3">
                                        <div className="col-lg-8 col-xs-12">
                                            <Button htmlType="submit" type="primary">
                                                {t('form_profile_submit')}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Edit;