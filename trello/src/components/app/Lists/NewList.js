import React, {Fragment, useState} from 'react';
import {Button, Form, Input, Modal} from "antd";
import {useTranslation} from "react-i18next";
import {CloseOutlined, PlusOutlined} from '@ant-design/icons'
import {useDispatch, useSelector} from "react-redux";
import {addListBoardAction} from "../../../actions/boardActions";
import {useParams} from "react-router-dom";

const modalStyle = {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)!important',
    borderRadius: '8px!important'
}

const NewList = () => {
    const {t} = useTranslation(['app', 'board'])
    const params = useParams();
    const {boardCode} = params

    const dispatch = useDispatch();
    const {loadingBoard} = useSelector(state => state.board);
    const addListBoard = (boardCode, name) => dispatch(addListBoardAction(boardCode, name))

    const [visible, setVisible] = useState(false);

    const [form, setForm] = useState({
        name: ''
    });
    const {name} = form

    const handleShowModal = () => setVisible(true)
    const handleCancel = () => setVisible(false)

    const onChange = (e) => {
        const field = e.target.name
        const value = e.target.value
        setForm({
            ...form, [field]: value
        })
    }

    const submitNewList = async () => {
        try {
            addListBoard(boardCode, name)
            setForm({name: ''})
            setVisible(false)
        } catch (e) {
        }
    }

    return (
        <Fragment>
            <Button onClick={handleShowModal} block className="button_add_list" type="primary">
                <div className="row">
                    <div className="col-8">{t('board:add_list_text')}</div>
                    <div className="col-4"><PlusOutlined/></div>
                </div>
            </Button>
            <Modal
                cancelButtonProps={{type: 'text', size: 'large', className: "mb-4", disabled: loadingBoard}}
                cancelText={t('cancel_text')}
                okText={t('create_text')}
                okButtonProps={{icon: <PlusOutlined/>, size: 'large', loading: loadingBoard, onClick: submitNewList}}
                closeIcon={<div/>}
                bodyStyle={modalStyle}
                visible={visible}
                onCancel={handleCancel}>
                <Button onClick={handleCancel} type="primary" className="button-close">
                    <CloseOutlined/>
                </Button>
                <Form
                    className="mt-3"
                    name="new_board"
                    initialValues={{name}}
                    onFinish={submitNewList}>
                    <Form.Item
                        required
                        rules={[{
                            required: true,
                            message: `${t('message_input')} ${t('label_name')}`
                        }]}>
                        <Input
                            disabled={loadingBoard}
                            value={name}
                            onChange={onChange}
                            name="name"
                            className="input-name-board"
                            placeholder={` ${t('board:add_list_placeholder')}`}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
    );
};
export default NewList;