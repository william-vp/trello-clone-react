import React, {Fragment, useState} from 'react';
import {Button, Form, Image, Input, Modal, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {CloseOutlined, PlusOutlined} from '@ant-design/icons'
import CoverBoardSelect from "../Boards/CoverBoardSelect";
import {openMessageInfo} from "../../../utils/alerts";
import axios from "../../../config/axios";

const modalStyle = {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)!important',
    borderRadius: '8px!important'
}

const {Paragraph, Text} = Typography

const NewCard = ({list, getCards}) => {
    const {t} = useTranslation(['app', 'board'])
    const [visible, setVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        cover: ''
    });
    const {name, cover} = form

    const handleShowModal = () => setVisible(true)
    const handleCancel = () => setVisible(false)

    const onChangeCover = (cover, srcFull) => {
        setForm({
            ...form, cover, coverUrl: srcFull
        })
    }

    const onChange = (e) => {
        const field = e.target.name
        const value = e.target.value
        setForm({
            ...form, [field]: value
        })
    }

    const submitNewCard = async () => {
        if (!name) return openMessageInfo('error', "Ingresa un nombre")
        if (!cover) return openMessageInfo('error', "Selecciona una portada")
        setLoading(true)
        try {
            const response = await axios.post(`/api/cards/${list._id}`, form);
            if (response.data.card) {
                setForm({name: '', cover: ''})
                setVisible(false)
                getCards(list._id)
            }
        } catch (e) {
        }
        setLoading(false)
    }

    return (
        <Fragment>
            <Button onClick={handleShowModal} block className="button_add_list" type="primary">
                <div className="row">
                    <div className="col-8">{t('board:add_card_text')}</div>
                    <div className="col-4"><PlusOutlined/></div>
                </div>
            </Button>
            <Modal
                cancelButtonProps={{type: 'text', size: 'large', className: "mb-4", disabled: loading}}
                cancelText={t('cancel_text')}
                okText={t('create_text')}
                okButtonProps={{icon: <PlusOutlined/>, size: 'large', loading, onClick: submitNewCard}}
                closeIcon={<div/>}
                bodyStyle={modalStyle}
                visible={visible}
                onCancel={handleCancel}>
                <Button onClick={handleCancel} type="primary" className="button-close">
                    <CloseOutlined/>
                </Button>

                <div className="text-center mt-3">
                    {cover ?
                        <Image
                            className="img-rounded-board"
                            width={'100%'}
                            height={250}
                            alt="cover image"
                            src={cover}/>
                        : <Image
                            className="img-rounded-board"
                            width={'100%'}
                            height={250}
                            src={"error"}
                            fallback="data:image/png;base64,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"
                        />}
                </div>

                <div className="containter my-2">
                    <CoverBoardSelect onChangeImage={onChangeCover}/>
                </div>

                <Form
                    className="mt-3"
                    name="new_board"
                    initialValues={{name}}
                    onFinish={submitNewCard}>
                    <Form.Item
                        required
                        rules={[{
                            required: true,
                            message: `${t('message_input')} ${t('board:label_card_name')}`
                        }]}>
                        <Input
                            disabled={loading}
                            value={name}
                            onChange={onChange}
                            name="name"
                            className="input-name-board"
                            placeholder={` ${t('board:placeholder_card_name')}`}/>
                    </Form.Item>
                    <Paragraph>
                        <Text>{t('board:in_list_text')}</Text> <Text strong>{list.name}</Text>
                    </Paragraph>
                </Form>
            </Modal>
        </Fragment>
    );
};
export default NewCard;