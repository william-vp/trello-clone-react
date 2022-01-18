import React, {Fragment, useEffect, useState} from 'react';
import NewCard from "./NewCard";
import axios from "../../../config/axios";
import CardItem from "./CardItem";
import {Droppable, Draggable} from 'react-beautiful-dnd';
import {useSelector} from "react-redux";

const CardsList = ({list}) => {
    const [cards, setCards] = useState([]);
    const {orderCardsList} = useSelector(state => state.board);

    const getCards = async listId => {
        const response = await axios.get(`/api/cards/${listId}`);
        if (response.data) setCards(response.data.cards)
    }

    useEffect(() => {
        if (list._id) getCards(list._id)
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        getCards(list._id);
        // eslint-disable-next-line
    }, [orderCardsList]);

    return (<Fragment>
        <Droppable droppableId={`${list._id}`}>
            {(provided) => (
                <ul className="cards_ul" style={{minHeight: '100px'}}  {...provided.droppableProps}
                    ref={provided.innerRef}>
                    {cards
                        .sort((a, b) => (a.position > b.position) ? 1 : -1)
                        .map((card, index) => {
                            return (
                                <div className="my-3" key={card._id}>
                                    {provided.placeholder}
                                    <Draggable key={card._id} draggableId={card._id} index={index}>
                                        {(provided) => (
                                            <li key={card._id}
                                                ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <CardItem card={card}/>
                                            </li>
                                        )}
                                    </Draggable>
                                </div>
                            )
                        })}
                </ul>
            )}
        </Droppable>
        {list && <NewCard getCards={getCards} list={list}/>}
    </Fragment>);
};
export default CardsList;
