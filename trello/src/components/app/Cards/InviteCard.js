import React, { Fragment, useEffect, useState } from 'react';
import { Avatar, Button, Form, List, Popover, Select, Typography, Tooltip } from "antd";
import { Search as SearchIcon, Group as GroupIcon } from "@material-ui/icons";
import { getRouteImage } from "../../../utils/format";
import { useTranslation } from "react-i18next";
import { UserOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import axios from "../../../config/axios";
import { useParams } from "react-router-dom";
import { openInfoLoading } from "../Auth/Alert";

const { Text, Paragraph } = Typography
const { Option } = Select

const InviteCard = ({ cardId, getCardMembers, cardMembers, type = null }) => {
    const params = useParams();
    const { boardCode } = params

    const { t } = useTranslation(['app', 'board'])

    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [query, setQuery] = useState('');

    const searchUsers = async () => {
        try {
            const response = await axios.post(`/api/membersCard/search/${cardId}`, { query, boardCode });
            if (response.data.users) setUsers(response.data.users)
        } catch (e) {
            setUsers([])
        }
    }

    const submitAddMember = async () => {
        openInfoLoading(true)
        try {
            const response = await axios.post(`/api/membersCard/${cardId}`, { users: selected, boardCode });
            if (response.data.users) setUsers(response.data.users)
            setSelected([])
            setUsers([])
            setQuery('')
            getCardMembers()
        } catch (e) {
            setUsers([])
        }
        openInfoLoading(false)
    }

    useEffect(() => {
        if (query.length > 2) {
            searchUsers()
        }
        // eslint-disable-next-line
    }, [query]);

    const onSearch = (value) => setQuery(value)

    const onChange = (val) => {
        const exists = selected.filter((user) => user.user._id === val)[0]
        if (exists) return false;

        const userSelected = users.filter((user) => user.user._id === val && user.user)[0]
        const usersSelected = [...selected, userSelected]
        setSelected(usersSelected)
    }

    const handleRemoveSelected = id => {
        const usersSelected = selected.filter((user) => user._id !== id && user)
        setSelected(usersSelected)
    }

    return (
        <Fragment>
            {type ?
                <div className="p-2">
                    {cardMembers.map((member) => {
                        return <Tooltip key={member._id}
                            title={member.user.name ? member.user.name : member.user.email}>
                            {member.user.photoUrl ?
                                <Avatar className="mr-1"
                                    size={32} shape="square"
                                    src={getRouteImage(member.user.photoUrl, 'users', 'avatar')} />
                                : <Avatar shape="square" icon={<UserOutlined />} />}
                        </Tooltip>
                    })}
                </div>
                :
                <Fragment>
                    <Paragraph className="mt-3 mb-0">
                        <GroupIcon className="m-icon" /> {t('member_label')}
                    </Paragraph>
                    {cardMembers.length > 0 && <Fragment>
                        <List
                            className="mt-0"
                            dataSource={cardMembers}
                            renderItem={item => (
                                <List.Item key={item._id}>
                                    <List.Item.Meta
                                        avatar={item.user.photoUrl ?
                                            <Avatar shape="square"
                                                src={getRouteImage(item.user.photoUrl, 'users', 'avatar')} /> :
                                            <Avatar shape="square" icon={<UserOutlined />} />}
                                        title={<Text
                                            className="name-label">{item.user.name ? item.user.name : item.user.email}</Text>}
                                    />
                                </List.Item>
                            )}>
                        </List>
                    </Fragment>}
                </Fragment>
            }

            <Popover
                placement="bottomLeft"
                onClick={e => e.stopPropagation()}
                content={<Fragment>
                    <Text strong>{t('board:invite_card_title')}</Text>
                    <Paragraph className="text-muted">
                        {t('board:invite_board_description')}
                    </Paragraph>
                    <div className="w-100 rounded-lg p-1 pt-0 my-0 group-search">
                        <Form
                            className="mt-0 pt-0"
                            name="customized_form_controls"
                            layout="inline"
                            initialValues={{}}>
                            <Form.Item name="price">
                                <Select
                                    defaultValue={""}
                                    showSearch
                                    notFoundContent={null}
                                    showArrow={false}
                                    style={{ width: 200 }}
                                    placeholder={t('search_user_placeholder')}
                                    optionFilterProp="children"
                                    onChange={(e) => onChange(e)}
                                    onSearch={onSearch}>
                                    {users.map((user) => {
                                        return <Option
                                            key={user.user._id}
                                            value={user.user.id}>{user.user.name ? user.user.name : user.user.email}</Option>
                                    })}
                                    {query.length > 2 && users.length === 0 &&
                                        <Text>No hay resultados encontrados</Text>}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    icon={<SearchIcon className="m-icon" />}
                                    type="primary rounded-lg mt-1 mr-0"
                                    size={"medium"} />
                            </Form.Item>
                        </Form>
                    </div>

                    {selected.length > 0 && <Fragment>
                        <div className="border border-light bg-white shadow-md p-2 mt-3 mb-5">
                            <List
                                dataSource={selected}
                                renderItem={item => (
                                    <List.Item key={item._id}>
                                        <List.Item.Meta
                                            avatar={item.user.photoUrl ?
                                                <Avatar shape="square"
                                                    src={getRouteImage(item.user.photoUrl, 'users', 'avatar')} /> :
                                                <Avatar shape="square" icon={<UserOutlined />} />}
                                            title={<Text
                                                className="name-label">{item.user.name ? item.user.name : item.user.email}</Text>}
                                        />
                                        <Button
                                            onClick={() => handleRemoveSelected(item._id)}
                                            size="small"
                                            icon={<CloseOutlined />} danger />
                                    </List.Item>
                                )}>
                            </List>
                        </div>
                        <div className="text-center">
                            <Button onClick={submitAddMember} type="primary">{t('board:invite_text')}</Button>
                        </div>
                    </Fragment>}
                </Fragment>}
                trigger="click">
                {type ?
                    <Button onClick={e => e.stopPropagation()} type="primary" icon={<PlusOutlined className="font-weight-bolder" />}
                        shape="square" />
                    :
                    <Button block className="button_add_list mb-3" type="primary">
                        <div className="row">
                            <div className="col-8">{t('board:assign_member_text')}</div>
                            <div className="col-4"><PlusOutlined /></div>
                        </div>
                    </Button>
                }

                {/*  <Button
                    block
                    type="default" size="large"
                    className="bg-gray border-0 rounded-lg p-1 text-gray px-3 mb-3">
                    <GroupIcon className="m-icon" /> {t('member_label')}
                </Button> */}
            </Popover>
        </Fragment>
    );
};
export default InviteCard;