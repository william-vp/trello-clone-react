import React, {Fragment, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Layout from "../../Layouts/Layout";
import axios from "../../../config/axios";
import Loading from "../../Layouts/Loading";
import {useDispatch, useSelector} from "react-redux";
import {selectBoardAction, setListsBoardAction} from "../../../actions/boardActions";
import BoardBanner from "./BoardBanner";
import tokenAuth from "../../../config/tokenAuth";
import BoardList from "../Lists/BoardList";
import {Empty} from "antd";
import {useTranslation} from "react-i18next";
import NewList from "../Lists/NewList";

const Board = () => {
    const params = useParams();
    const {boardCode} = params

    const {t} = useTranslation(['board']);
    const [loading, setLoading] = useState(true);
    const {listsSelectedBoard} = useSelector(state => state.board);

    const dispatch = useDispatch();
    const selectBoard = board => dispatch(selectBoardAction(board))
    const setListsBoard = lists => dispatch(setListsBoardAction(lists))

    const getBoard = async boardCode => {
        setLoading(true)
        try {
            const token = localStorage.getItem('authToken');
            if (token) tokenAuth(token)
            const response = await axios.get(`/api/boards/${boardCode}`);
            if (response.data) {
                selectBoard(response.data.board)
            }
        } catch (e) {
        }
        setLoading(false)
    }

    useEffect(() => {
        if (boardCode) {
            getBoard(boardCode)
            setListsBoard(boardCode)
        }
        // eslint-disable-next-line
    }, [boardCode]);

    if (loading) return <Loading/>

    return (
        <Layout>
            <BoardBanner/>
            <div className="container-fluid px-5">
                <div className="bg-container-gray mt-0 rounded-lg p-5">
                    {listsSelectedBoard && <Fragment>
                        {listsSelectedBoard.length > 0 && <BoardList lists={listsSelectedBoard}/>}
                        {listsSelectedBoard.length == 0 &&
                            <Fragment>
                                <Empty description={t('no_lists')}>
                                    <NewList button_style={1}/>
                                </Empty>
                            </Fragment>}
                    </Fragment>}
                </div>
            </div>
        </Layout>
    );
};
export default Board;