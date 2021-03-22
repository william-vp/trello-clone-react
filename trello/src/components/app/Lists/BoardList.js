import React, { Fragment, useState, useEffect } from 'react';
import NewList from "./NewList";
import ListItem from "./ListItem";
import { DragDropContext } from 'react-beautiful-dnd';
import axios from "../../../config/axios";
import { setOrderCardsListAction } from "../../../actions/boardActions";
import { useDispatch } from "react-redux";

const BoardList = ({ lists }) => {
    const [order, setOrder] = useState([])

    const dispatch = useDispatch();
    const setOrderCardsList = order => dispatch(setOrderCardsListAction(order))

    useEffect(() => {
        let order = []
        lists.forEach(list => {
            order.push({ _id: list._id, cards: list.cards })
        });
        setOrder(order)
        setOrderCardsList(order)
        // eslint-disable-next-line
    }, [lists])

    const onDragEnd = result => {
        //console.log(result)
        const { destination, source, draggableId } = result;
        console.log(result)

        if (!destination) return
        if (destination.droppableId === source.droppableId && destination.index === source.index) return

        const startList = order.filter(o => o._id === source.droppableId)[0];
        const finishList = order.filter(o => o._id === destination.droppableId)[0];
        //console.log(startList)
        //console.log(finishList)

        if (startList._id === finishList._id) {
            let newLists = []
            order.forEach(ord => {
                if (ord._id === startList._id) {
                    const dest_index = destination.index
                    let cardsList = ord.cards
                    cardsList[source.index].position = destination.index;
                    cardsList[dest_index].position = source.index;

                    handleChangeNewPosition({ _id: cardsList[source.index]._id, position: cardsList[source.index].position })
                    handleChangeNewPosition({ _id: cardsList[dest_index]._id, position: cardsList[dest_index].position })
                    ord.cards = cardsList
                }
                newLists.push(ord)
            })
            setOrder(newLists)
            setOrderCardsList(newLists)
        } else {

        }

    }

    const handleChangeNewPosition = async card => {
        const { _id, position } = card
        try {
            const response = await axios.put(`/api/cards/${_id}`, { position });
            if (response.data.card) {

            }
        } catch (e) {
        }
    }

    return (
        <Fragment>
            <div className="row justify-content-center">

                <DragDropContext onDragEnd={onDragEnd}>
                    {lists.map((list) => {
                        return <div key={list._id} className="col-lg-3 col-md-4 col-xs-6 col-sm-6">
                            <ListItem list={list} />
                        </div>
                    })}
                </DragDropContext>

                <div className="col-lg-3 col-md-4 col-xs-6 col-sm-6">
                    <NewList />
                </div>
            </div>
        </Fragment >
    );
};
export default BoardList;