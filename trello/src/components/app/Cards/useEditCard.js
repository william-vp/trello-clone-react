import React, { Fragment, useState, useEffect } from 'react';
import { Button, Form, Image, Input, Modal, Typography, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { CloseOutlined } from '@ant-design/icons'
import CoverBoardSelect from '../Boards/CoverBoardSelect';
import { openMessageInfo } from '../../../utils/alerts';
import axios from '../../../config/axios';
import { Description as DescriptionIcon, Create as CreateIcon, AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import Comments from './Comments'
import Attachments from './Attachments'
import InviteCard from './InviteCard'

const modalStyle = {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)!important',
    borderRadius: '8px!important'
}
const { Paragraph, Text } = Typography

const useEditCard = (card) => {
    const { t } = useTranslation(['app', 'board'])
    const [visible, setVisible] = useState(false);

    const [editDescCard, setEditDescCard] = useState(false)
    const [textDescCard, setTextDescCard] = useState(card.description)
    const [cardMembers, setCardMembers] = useState([])

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: card.name,
        cover: card.coverUrl
    });
    const { name, cover } = form

    useEffect(() => {
        getCardMembers()
        // eslint-disable-next-line
    }, [])

    const handleShowModal = () => setVisible(true)
    const handleCancel = () => setVisible(false)

    const onChangeCover = async (cover, srcFull) => {
        setForm({
            ...form, cover, coverUrl: srcFull
        })
        const response = await axios.put(`/api/cards/${card._id}`, {coverUrl: srcFull});
        if (response.data.card) {
            card.coverUrl = response.data.card.srcFull
        }
    }

    const getCardMembers = async () => {
        try {
            const response = await axios.get(`/api/membersCard/${card._id}`);
            if (response.data.members) setCardMembers(response.data.members)
        } catch (e) {
            message.error('warnign', "Eror mostrando los miembros de la tarjeta")
        }
    }

    const submitEditComment = async () => {
        if (!textDescCard) return openMessageInfo('error', "Ingresa un comentario")
        setLoading(true)
        try {
            const response = await axios.put(`/api/cards/${card._id}`, { description: textDescCard });
            if (response.data.card) {
                setTextDescCard(response.data.card.description)
                card.description = response.data.card.description
                setEditDescCard(false)
            }
        } catch (e) {
        }
        setLoading(false)
    }

    const modalEditCard = () => {
        if (card) {
            return (
                <Fragment>
                    <Modal
                        width={700}
                        footer={null}
                        closeIcon={<div />}
                        bodyStyle={modalStyle}
                        visible={visible}
                        onCancel={handleCancel}>

                        <Button onClick={handleCancel} type="primary" className="button-close">
                            <CloseOutlined />
                        </Button>

                        <div className="text-center mt-3">
                            {cover ?
                                <Image
                                    className="img-rounded-board"
                                    width={'100%'}
                                    height={250}
                                    alt="cover image"
                                    src={cover} />
                                : <Image
                                    className="img-rounded-board"
                                    width={'100%'}
                                    height={250}
                                    src={"error"}
                                    fallback="data:image/png;base64,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"
                                />}
                        </div>

                        <div className="row">
                            <div className="col-lg-8">
                                <Form
                                    className="mt-3"
                                    name="new_board"
                                    initialValues={{ name }}>
                                    <Form.Item
                                        required
                                        rules={[{
                                            required: true,
                                            message: `${t('message_input')} ${t('board:label_card_name')}`
                                        }]}>

                                        <div onDoubleClick={() => setEditing(true)}>
                                            <Paragraph
                                                className="w-100"
                                                editable={{
                                                    tooltip: false,
                                                    editing,
                                                    //onChange: (value) => handleEdit(list._id, value),
                                                    icon: <></>
                                                }}>
                                                {card.name}
                                            </Paragraph>
                                        </div>
                                        <Text>{t('board:in_list_text')}</Text> <Text strong>{card.list.name}</Text>
                                    </Form.Item>

                                    {/* description */}
                                    <Paragraph>
                                        <Text className="label-small mt-5 mr-2">
                                            <DescriptionIcon className="m-icon" /> {t('description_label')}
                                        </Text>
                                        {!editDescCard && <>
                                            <Button
                                                onClick={() => setEditDescCard(true)} size="small"
                                                className={"p-2 pt-0"}>
                                                <CreateIcon className="m-icon" fontSize={"small"} /> {t('edit_text')}
                                            </Button>
                                        </>}
                                    </Paragraph>

                                    {editDescCard ?
                                        <div className="container shadow-lg border-gray rounded-lg mb-5">
                                            <Form.Item
                                                className="my-2"
                                                name="description">
                                                <Input.TextArea
                                                    value={textDescCard}
                                                    defaultValue={card.description}
                                                    className="textarea-profile ml-0 pl-0"
                                                    name="description"
                                                    onChange={(e) => setTextDescCard(e.target.value)}
                                                    bordered={false}
                                                    placeholder={t('description_label')}
                                                    autoSize={{ minRows: 3, maxRows: 25 }}
                                                    size="large" />
                                            </Form.Item>

                                            <div className="text-right p-2">
                                                <Space>
                                                    <Button onClick={() => {
                                                        setEditDescCard(false)
                                                        setTextDescCard(card.description)
                                                    }} disabled={loading} type="secondary">
                                                        {t('cancel_text')}
                                                    </Button>
                                                    {card.description !== textDescCard &&
                                                        <Button onClick={submitEditComment} loading={loading}
                                                            type="primary">{t('board:edit')}
                                                        </Button>}
                                                </Space>
                                            </div>
                                        </div>
                                        : <Paragraph onDoubleClick={() => setEditDescCard(true)} style={{ whiteSpace: 'pre-wrap' }}>{textDescCard}</Paragraph>}
                                    <Attachments cardId={card._id} />
                                    <Comments cardId={card._id} />
                                </Form>
                            </div>
                            <div className="col-lg-4 px-0">
                                <div className="container-fluid my-2">
                                    <Paragraph>
                                        <AccountCircleIcon className="m-icon" /> {t('actions_label')}
                                    </Paragraph>

                                    <CoverBoardSelect onChangeImage={onChangeCover} />

                                    <InviteCard getCardMembers={getCardMembers} cardMembers={cardMembers} cardId={card._id} />
                                </div>
                            </div>
                        </div>
                    </Modal>
                </Fragment >
            );
        }
    }
    return { modalEditCard, handleShowModal }
};
export default useEditCard;