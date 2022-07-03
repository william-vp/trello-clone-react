import React, {Fragment, useEffect, useState} from 'react';
import Layout from "../../Layouts/Layout";
import {MotionScreen} from 'react-motion-layout';
import {Typography} from "antd";
import {useTranslation} from "react-i18next";
import BoardCard from "./BoardCard";
import NewBoard from "./NewBoard";
import {useDispatch, useSelector} from "react-redux";
import {getBoardUserAction, selectBoardAction} from "../../../actions/boardActions";
import Loading from "../../Layouts/Loading";
import {useHistory} from "react-router-dom";

const {Title, Paragraph} = Typography

const Boards = () => {
    const {t} = useTranslation(['app'])

    const dispatch = useDispatch();
    const {boards, loadingBoard, search} = useSelector(state => state.board);
    const [resultsSearch, setResultsSearch] = useState([]);
    const history = useHistory()

    const getBoards = () => dispatch(getBoardUserAction())
    const selectBoard = board => dispatch(selectBoardAction(board))

    useEffect(() => {
        if (sessionStorage.getItem("loggedIn") === null) {
            console.log("redirecting to login");
            history.push("/login");
        }else{
            selectBoard(null)
            getBoards()
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (search !== '') {
            const boardsUser = [...boards]
            let results = boardsUser.filter(board => {
                if (board.name.toLowerCase().includes(search.toLowerCase())) return board;
                return false;
            })
            setResultsSearch(results)
        } else {
            setResultsSearch([])
        }
        // eslint-disable-next-line
    }, [search]);

    if (loadingBoard) return <Loading/>

    return (
        <Layout>
            <div className="container-fluid w-100 mt-0 pt-0">
                <div className="container mx-auto pt-lg-5 pt-md-5 pt-xs-4">
                    <div className="row my-lg-3 my-md-5 my-sm-4">
                        <div className="col-6">
                            <Title level={3}>{t('app:all_boards')}</Title>
                        </div>
                        <div className="col-6 text-right">
                            <NewBoard getBoards={getBoards}/>
                        </div>
                    </div>
                    <div className="row w-100 mx-0">
                        <MotionScreen>
                            {search !== '' && <Fragment>
                                {resultsSearch.length > 0 && <>
                                    <Title level={5}>{t('app:search_text')} '{search}'</Title>
                                    {resultsSearch.map((board, i) =>
                                        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6" key={i}>
                                            <BoardCard board={board}/>
                                        </div>
                                    )}
                                </>}
                                {resultsSearch.length === 0 && <Paragraph type="secondary" level={5}>{t('app:searching_no_results')}</Paragraph> }
                            </Fragment>}

                            {boards.length > 0 && resultsSearch.length === 0 && <>
                                {boards.map((board, i) =>
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6" key={i}>
                                        <BoardCard board={board}/>
                                    </div>
                                )}
                            </>}
                        </MotionScreen>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Boards;