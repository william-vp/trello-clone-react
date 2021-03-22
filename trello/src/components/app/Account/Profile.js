import React, {useContext} from 'react';
import Layout from "../../Layouts/Layout";
import {Avatar, Button, Card, Divider, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {Auth} from "../../../contexts/AuthContext";
import Loading from "../../Layouts/Loading";
import {Email as EmailIcon} from '@material-ui/icons';

import google from "../../../static/images/Google.svg";
import fb from "../../../static/images/Facebook.svg";
import {Link} from "react-router-dom";
import {getRouteImage} from "../../../utils/format";

const {Text, Title, Paragraph} = Typography

const Profile = () => {
    const {t} = useTranslation(['auth'])
    const {profile, loadingUser, loadingAuth} = useContext(Auth);

    if (loadingUser || loadingAuth) return <Loading/>
    if (!profile) return "null"
    const {name, email, photoUrl, phoneNumber, provider, bio} = profile

    return (
        <Layout>
            <div className="container-fluid w-100 bg-container-gray my-0 py-0">
                <div className="container mx-auto pt-5">
                    <div className="row my-md-3 h-100 p-0">
                        <div className="col-lg-8 col-xs-12 text-center mx-auto">
                            <Paragraph>
                                <Title level={4}>{t('profile_title')}</Title>
                                <Text>{t('profile_subtitle')}</Text>
                            </Paragraph>
                        </div>
                        <div className="col-lg-8 col-xs-12 mx-lg-auto mx-xs-0 mb-5 mt-5 px-0">
                            <Card
                                bodyStyle={{paddingLeft: 0, paddingRight: 0}}
                                className="card-profile w-100 bg-transparent mb-5">
                                <div className="row py-1 pl-lg-5 px-sm-3">
                                    <div className="col-8">
                                        <Title level={4}>{t('info_profile_title')}</Title>
                                        <Text type="secondary">{t('info_profile_subtitle')}</Text>
                                    </div>
                                    <div className="col-4 text-right">
                                        <Link to={"/profile/edit"}>
                                            <Button type="ghost">
                                                {t('info_profile_button')}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <Divider/>
                                <div className="row py-1 pl-lg-5 px-sm-3">
                                    <div className="col-4">
                                        <Text strong type="secondary">{t('label_photo')}</Text>
                                    </div>
                                    <div className="col-8 text-left">
                                        <Avatar
                                            size={72}
                                            shape="square"
                                            src={getRouteImage(photoUrl, 'users', 'avatar')}/>
                                    </div>
                                </div>
                                <Divider/>
                                <div className="row py-1 pl-lg-5 px-sm-3">
                                    <div className="col-4">
                                        <Text strong type="secondary">{t('label_name')}</Text>
                                    </div>
                                    <div className="col-8 text-left">
                                        <Text>{name}</Text>
                                    </div>
                                </div>
                                <Divider/>
                                <div className="row py-1 pl-lg-5 px-sm-3">
                                    <div className="col-4">
                                        <Text strong type="secondary">{t('label_bio')}</Text>
                                    </div>
                                    <div className="col-8 text-left">
                                        <Text>{bio}</Text>
                                    </div>
                                </div>
                                <Divider/>
                                <div className="row py-1 pl-lg-5 px-sm-3">
                                    <div className="col-4">
                                        <Text strong type="secondary">{t('label_phone')}</Text>
                                    </div>
                                    <div className="col-8 text-left">
                                        <Text>{phoneNumber}</Text>
                                    </div>
                                </div>
                                <Divider/>
                                <div className="row py-1 pl-lg-5 px-sm-3">
                                    <div className="col-4">
                                        <Text
                                            className="text-uppercase"
                                            strong type="secondary">
                                            {t('email_label')}</Text>
                                    </div>
                                    <div className="col-8 text-left">
                                        <Text>{email}</Text>
                                    </div>
                                </div>
                                <Divider/>
                                <div className="row py-1 pl-lg-5 px-sm-3">
                                    <div className="col-4">
                                        <Text
                                            className="text-uppercase"
                                            strong type="secondary">
                                            {t('provider_label')}</Text>
                                    </div>
                                    <div className="col-8 text-left">
                                        {provider === 'google' &&
                                        <Button type="link">
                                            <Avatar size="large" src={google}/>
                                        </Button>}
                                        {provider === 'facebook' &&
                                        <Button type="link">
                                            <Avatar size="large" src={fb}/>
                                        </Button>}
                                        {provider === 'email' &&
                                        <Button type="link">
                                            <EmailIcon/>
                                        </Button>}
                                    </div>
                                </div>
                                <Divider/>
                                <div className="row py-1 pl-lg-5 px-sm-3">
                                    <div className="col-4">
                                        <Text
                                            className="text-uppercase"
                                            strong type="secondary">
                                            {t('password_label')}</Text>
                                    </div>
                                    <div className="col-8 text-left">
                                        <Text>**********</Text>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Profile;