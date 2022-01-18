import React, {useEffect, useState} from 'react';
import {Card, message, Space, Typography} from "antd";
import useEditCard from "./useEditCard";
import InviteCard from "./InviteCard";
import axios from "../../../config/axios";
import {AttachFile, Comment} from "@material-ui/icons";

const {Text} = Typography

const CardItem = ({card}) => {
    const {coverUrl, name} = card
    const {modalEditCard, handleShowModal} = useEditCard(card)

    const [cardMembers, setCardMembers] = useState([])
    const [commentsLength, setCommentsLength] = useState(0)
    const [atachmentsLenght, setAtachmentsLenght] = useState(0)

    useEffect(() => {
        getCardMembers()
        getCardCommentsLength()
        getAttachments()
        // eslint-disable-next-line
    }, [])

    const getCardMembers = async () => {
        try {
            const response = await axios.get(`/api/membersCard/${card._id}`);
            if (response.data.members) setCardMembers(response.data.members)
        } catch (e) {
            message.error('warnign', "Error mostrando los miembros de la tarjeta")
        }
    }

    const getCardCommentsLength = async () => {
        try {
            const response = await axios.get(`/api/commentsCard/${card._id}/getCommentsCardLength`);
            if (response.data.commentsLength) setCommentsLength(response.data.commentsLength)
        } catch (e) {
        }
    }

    const getAttachments = async () => {

        try {
            const response = await axios.get(`/api/files/${card._id}/length`);
            if (response.data.files) {
                setAtachmentsLenght(response.data.files)
            }
        } catch (e) {
        }
    }

    return (
        <>
            <Card
                hoverable
                onClick={handleShowModal}
                bodyStyle={{padding: '12px', paddingBottom: '20px'}}
                bordered={false}
                className="card-board">
                {coverUrl && <img
                    alt="example" className="w-100 card-image"
                    src={coverUrl}/>}
                <Text className="card-board-title my-4"> {name}</Text>

                <div className="row mt-3 p-0">
                    <div className="col-7" onClick={e => e.stopPropagation()}>
                        <InviteCard
                            type="card"
                            cardId={card._id}
                            cardMembers={cardMembers}
                            getCardMembers={getCardMembers}/>
                    </div>
                    <div className="col-5">
                        <Space>
                            <AttachFile/>
                            <Text> {atachmentsLenght}</Text>
                            <Comment/>
                            <Text> {commentsLength}</Text>
                        </Space>
                    </div>
                </div>
            </Card>
            {modalEditCard()}
        </>
    );
};
export default CardItem;