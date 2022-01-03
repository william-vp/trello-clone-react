import React, {Fragment, useEffect, useState} from 'react';
import {Avatar, Button, Form, List, Popover, Select, Tooltip, Typography} from "antd";
import {Search as SearchIcon} from "@material-ui/icons";
import {getRouteImage} from "../../../utils/format";
import {useTranslation} from "react-i18next";
import {PlusOutlined, UserOutlined, CloseOutlined} from '@ant-design/icons'
import axios from "../../../config/axios";
import {useParams} from "react-router-dom";
import {openInfoLoading} from "../Auth/Alert";
import {getBoardMembersAction} from "../../../actions/boardActions";
import {useDispatch} from "react-redux";

const {Text, Paragraph} = Typography
const {Option} = Select

const InviteBoard = () => {
    const params = useParams();
    const {boardCode} = params

    const {t} = useTranslation(['app', 'board'])

    const dispatch = useDispatch();
    const getMembers = board => dispatch(getBoardMembersAction(board))

    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [query, setQuery] = useState('');

    const searchUsers = async () => {
        try {
            const response = await axios.post(`/api/members/search/${boardCode}`, {query});
            if (response.data.users) setUsers(response.data.users)
        } catch (e) {
            setUsers([])
        }
    }

    const submitAddMember = async () => {
        openInfoLoading(true)
        try {
            const response = await axios.post(`/api/members/${boardCode}`, {users: selected});
            if (response.data.users) setUsers(response.data.users)
            setSelected([])
            setUsers([])
            setQuery('')
            getMembers(boardCode)
        } catch (e) {
            setUsers([])
        }
        openInfoLoading(false)
    }

    useEffect(() => {
        if (query.length > 3) {
            searchUsers()
        }
        // eslint-disable-next-line
    }, [query]);

    const onSearch = (value) => setQuery(value)

    const onChange = (val) => {
        const exists = selected.filter((user) => user._id === val)[0]
        if (exists) return false;

        const userSelected = users.filter((user) => user._id === val && user)[0]
        const usersSelected = [...selected, userSelected]
        setSelected(usersSelected)
    }

    const handleRemoveSelected = id => {
        const usersSelected = selected.filter((user) => user._id !== id && user)
        setSelected(usersSelected)
    }

    return (
        <Fragment>
                <Popover
                    placement="bottomLeft"
                    content={<Fragment>
                        <Text strong>{t('board:invite_board_title')}</Text>
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
                                        showSearch autoClearSearchValue
                                        showArrow={false}
                                        style={{width: 200}}
                                        placeholder={t('search_user_placeholder')}
                                        optionFilterProp="children"
                                        onChange={(e) => onChange(e)}
                                        notFoundContent={null}
                                        onSearch={onSearch}>
                                        {users.map((user) => {
                                            return <Option
                                                key={user._id}
                                                value={user.id}>{user.name ? user.name : user.email}</Option>
                                        })}
                                        {query.length > 3 && users.length === 0 &&
                                            <Text>{t('board:no_results_search_user')}</Text>}
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        icon={<SearchIcon className="m-icon"/>}
                                        type="primary rounded-lg mt-1 mr-0"
                                        size={"medium"}/>
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
                                                avatar={item.photoUrl ?
                                                    <Avatar shape="square"
                                                            src={getRouteImage(item.photoUrl, 'users', 'avatar')}/> :
                                                    <Avatar shape="square" icon={<UserOutlined/>}/>}
                                                title={<Text
                                                    className="name-label">{item.name ? item.name : item.email}</Text>}
                                            />
                                            <Button
                                                onClick={() => handleRemoveSelected(item._id)}
                                                size="small"
                                                icon={<CloseOutlined/>} danger/>
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
                    <Tooltip title={t('board:invite_board_title')}>
                        <Button type="primary" icon={<PlusOutlined className="font-weight-bolder"/>} shape="square"/>
                    </Tooltip>
                </Popover>
        </Fragment>
    );
};
export default InviteBoard;