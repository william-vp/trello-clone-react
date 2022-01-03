import React, { useState, useContext, useEffect } from 'react';
import { Button, Input, Typography, Space, Avatar, Card, Divider, Popconfirm } from "antd";
import { useTranslation } from "react-i18next";
import axios from "../../../config/axios";
import { getRouteImage } from "../../../utils/format";
import { Auth } from "../../../contexts/AuthContext";
import { openMessageInfo } from "../../../utils/alerts";
import { getDateRelative, getRouteAvatar } from "../../../utils/format";
import { EditOutlined } from '@ant-design/icons'

const { Paragraph, Text } = Typography
const { Meta } = Card

const Comments = ({ cardId }) => {
    const { t } = useTranslation(['app', 'board'])

    const { profile } = useContext(Auth);
    const { photoUrl } = profile;

    const [newComment, setNewComment] = useState(null)
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState([])
    const [commentIdEdit, setCommentIdEdit] = useState('')

    useEffect(() => {
        if (cardId) getComments()
        // eslint-disable-next-line
    }, [cardId])

    const submitNewComment = async () => {
        if (!newComment) return openMessageInfo('error', "Ingresa un comentario")
        setLoading(true)
        try {
            const response = await axios.post(`/api/commentsCard/${cardId}`, { text: newComment, cardId });
            if (response.data.comment) {
                setNewComment('')
                getComments()
            }
        } catch (e) {
        }
        setLoading(false)
    }

    const getComments = async () => {
        setLoading(true)
        const response = await axios.get(`/api/commentsCard/${cardId}`);
        if (response.data.comments) {
            setComments(response.data.comments)
        }
        setLoading(false)
    }

    const handleEditComment = async (text, commentId) => {
        if (!text) return openMessageInfo('error', "Ingresa un comentario válido")
        setLoading(true)
        try {
            const response = await axios.put(`/api/commentsCard/${cardId}`, { text, commentId });
            if (response.data.comment) {
                getComments()
                setCommentIdEdit('')
            }
        } catch (e) {
        }
        setLoading(false)
    }

    const handleDeleteComment = async commentId => {
        if (!commentId) return;
        setLoading(true)
        try {
            const response = await axios.delete(`/api/commentsCard/${commentId}`);
            if (response.data.details === 'success') {
                getComments()
            }
        } catch (e) {
        }
        setLoading(false)
    }

    return (
        <>
            {/*  input comment */}
            <div className="container shadow-lg border-gray rounded-lg mt-5 mb-5">
                <Input size="large"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="ml-0 pl-0"
                    bordered={false}
                    placeholder={t('board:write_comment_text')}
                    prefix={<Avatar
                        size={72}
                        shape="square"
                        src={getRouteImage(photoUrl, 'users', 'avatar')} />} />
                <div className="text-right p-2">
                    {newComment &&
                        <Button loading={loading} disabled={loading} type="primary" onClick={submitNewComment}>
                            {t('board:comment_text')}
                        </Button>}
                </div>
            </div>

            {/*comments*/}
            {comments.length > 0 &&
                <>
                    {comments.map(comment => {
                        return <div className="row" key={comment._id}>
                            <div className="col-9">
                                <Meta
                                    avatar={<Avatar size={150} shape="square"
                                        src={getRouteAvatar(comment.user.photoUrl)} />}
                                    title={
                                        <>
                                            <Text strong className="mb-0">{comment.user.name}</Text>
                                            <Paragraph>
                                                <Text
                                                    className="text-muted mt-0 text-small">{getDateRelative(comment.updated_at)}</Text>
                                            </Paragraph>
                                        </>
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <Space>
                                    <Button
                                        type="link"
                                        onClick={() => setCommentIdEdit(comment._id)}
                                        className="text-muted">{t('board:edit')}</Button>
                                    <span className="text-muted"> - </span>
                                    <Popconfirm
                                        title={t('board:question_delete_comment')}
                                        onConfirm={() => handleDeleteComment(comment._id)}
                                        onCancel={() => false}
                                        okText="Ok"
                                        cancelText={t('cancel_text')}>
                                        <Button
                                            type="link"
                                            className="text-muted">{t('board:delete')}</Button>
                                    </Popconfirm>
                                </Space>
                            </div>
                            <div className="col-12 mt-0">
                                <Paragraph
                                    editable={{
                                        icon: <EditOutlined onClick={() => setCommentIdEdit(comment._id)} />,
                                        onChange: (e) => handleEditComment(e, comment._id),
                                        tooltip: t('board:edit_comment'),
                                        editing: comment._id === commentIdEdit
                                    }}>{comment.text}</Paragraph>
                                <Divider />
                            </div>
                        </div>
                    })}
                </>

            }

        </>
    );
};

export default Comments;