import React, {useState} from 'react';
import {Dropdown, Menu, Typography, Button} from "antd";
import {
    MoreHoriz as MoreHorizIcon,
} from "@material-ui/icons";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {deleteListBoardAction, editListBoardAction} from "../../../actions/boardActions";
import CardsList from "../Cards/CardsList";

const {Paragraph} = Typography;

const ListItem = ({list}) => {
    const {t} = useTranslation(['board'])

    const dispatch = useDispatch();
    const editListBoard = (id, name) => dispatch(editListBoardAction(id, name))
    const deleteListBoard = id => dispatch(deleteListBoardAction(id))

    const menu = (<Menu>
        <Menu.Item>
            <Button onClick={() => setEditing(true)} type="text">{t('rename_text')}</Button>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item>
            <Button onClick={() => handleSubmitDelete(list._id)} type="text"> {t('delete_list_text')}</Button>
        </Menu.Item>
    </Menu>);

    const [editing, setEditing] = useState(false);

    const handleSubmitDelete = async (id) => deleteListBoard(id)

    const handleEdit = (id, name) => {
        editListBoard(id, name)
        setEditing(false)
    }

    return <div className="row p-2">
        <div className="col-12 mb-4">
            <div className="row">
                <div className="col-6" onDoubleClick={() => setEditing(true)}>
                    <Paragraph
                        className="w-100"
                        editable={{
                            tooltip: false,
                            editing,
                            onChange: (value) => handleEdit(list._id, value),
                            icon: <></>
                        }}>
                        {list.name}
                    </Paragraph>
                </div>
                <div className="col-6 text-right">
                    <Dropdown overlay={menu}>
                        <MoreHorizIcon className="m-icon"/>
                    </Dropdown>
                </div>
            </div>
            {list && <CardsList list={list}/>}
        </div>
    </div>
}

export default ListItem;