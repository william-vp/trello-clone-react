import React, {Fragment, useContext, useState} from 'react';
import {Button, Drawer, Typography, Card, Avatar, Form, Input, Space, List} from "antd";
import {
    MoreHoriz as MoreHorizIcon,
    AccountCircle as AccountCircleIcon,
    Description as DescriptionIcon,
} from "@material-ui/icons";
import {useTranslation} from "react-i18next";
import {Auth} from "../../../contexts/AuthContext";
import {getRouteImage, getDateString} from "../../../utils/format";
import Page403 from "../../Layouts/Errors/403";
import {useDispatch, useSelector} from "react-redux";
import Loading from "../../Layouts/Loading";
import Page404 from "../../Layouts/Errors/404";
import {deleteMemberBoardAction, updateBoardAction} from "../../../actions/boardActions";
import {UserOutlined} from '@ant-design/icons'

const {Text, Paragraph, Title} = Typography
const {Meta} = Card

const Settings = () => {
    const {t} = useTranslation(['app', 'board'])

    const dispatch = useDispatch();
    const {profile} = useContext(Auth);
    const {loading, selectedBoard, membersSelectedBoard} = useSelector(state => state.board);

    const updateBoard = (id, board) => dispatch(updateBoardAction(id, board))
    const deleteMember = (memberId) => dispatch(deleteMemberBoardAction(memberId))

    const {user, created_at} = selectedBoard
    const {photoUrl, name, email} = user

    const [visible, setVisible] = useState(false);
    const [form, setForm] = useState({
        description: selectedBoard.description
    });
    const {description} = form

    if (loading) return <Loading/>
    if (!selectedBoard) return <Page404/>

    const showDrawer = () => setVisible(true);

    const handleClose = () => setVisible(false);

    const onChange = (e) => {
        const field = e.target.name
        const value = e.target.value
        setForm({
            ...form, [field]: value
        })
    }

    const handleUpdateBoard = () => {
        updateBoard(selectedBoard._id, form)
    }

    if (!profile) return <Page403/>

    return (
        <Fragment>
            <Button
                onClick={showDrawer}
                icon={<MoreHorizIcon className="m-icon mx-1"/>}
                type="primary" size="middle"
                className="btn-gray">
                {t('menu_title')}
            </Button>
            <Drawer
                drawerStyle={{
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
                }}
                headerStyle={{
                    borderBottomWidth: '90%!important'
                }}
                width={377}
                title={<Title level={5}>{t('menu_title')}</Title>}
                placement="right"
                closable={true}
                onClose={handleClose}
                visible={visible}>
                <Text className="label-small"><AccountCircleIcon className="m-icon"/> {t('made_by')}</Text>

                <Meta className="mt-4 mb-2 meta-menu"
                      avatar={photoUrl ?
                          <Avatar shape="square" src={getRouteImage(photoUrl, 'users', 'avatar')}/>
                          : <Avatar shape="square" icon={<UserOutlined/>}/>}
                      title={<Fragment>
                          <Text style={{marginTop: '-5px'}} className="name-label">{name ? name : email}</Text>
                          <Paragraph className="label-small">
                              {getDateString(created_at, true)}
                          </Paragraph>
                      </Fragment>}/>

                <Text className="label-small mt-5"><DescriptionIcon className="m-icon"/> {t('description_label')}</Text>

                <Form className="mt-3 mb-2"
                      name="basic"
                      initialValues={{description}}
                      onFinish={handleUpdateBoard}>

                    <Form.Item
                        className="my-3"
                        name="description">
                        <Input.TextArea
                            className="textarea-profile"
                            name="description"
                            onChange={onChange}
                            placeholder={t('description_label')}
                            autoSize={{minRows: 3, maxRows: 25}}
                            size="large"/>
                    </Form.Item>

                    <Space size="small">
                        <Button htmlType="submit" className="bg-green">{t('save_text')}</Button>
                        <Button onClick={handleClose} type="text">{t('cancel_text')}</Button>
                    </Space>
                </Form>

                <Paragraph className="mt-5 mb-3">
                    <Text className="label-small"><DescriptionIcon className="m-icon"/> {t('team_label')}</Text>
                </Paragraph>

                {membersSelectedBoard && <List
                    dataSource={membersSelectedBoard}
                    renderItem={item => (
                        <List.Item key={item._id}>
                            <List.Item.Meta
                                avatar={item.user.photoUrl ?
                                    <Avatar shape="square" src={getRouteImage(item.user.photoUrl, 'users', 'avatar')}/>
                                    : <Avatar shape="square" icon={<UserOutlined/>}/>}
                                title={<Text
                                    className="name-label">{item.user.name ? item.user.name : item.user.email}</Text>}/>
                            <Fragment>
                                {item._id === selectedBoard.user._id ?
                                    <Text disabled className="text-center">Admin</Text>
                                    : <Button
                                        onClick={() => deleteMember(item._id)}
                                        size="small" danger>{t('remove_text')}</Button>
                                }
                            </Fragment>
                        </List.Item>
                    )}>
                </List>}
            </Drawer>
        </Fragment>
    );
};
export default Settings;