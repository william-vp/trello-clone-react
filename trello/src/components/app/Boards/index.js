import React, {useEffect} from 'react';
import Layout from "../../Layouts/Layout";
import {MotionScreen} from 'react-motion-layout';
import {Typography} from "antd";
import {useTranslation} from "react-i18next";
import BoardCard from "./BoardCard";
import NewBoard from "./NewBoard";
import {useDispatch, useSelector} from "react-redux";
import {getBoardUserAction, selectBoardAction} from "../../../actions/boardActions";
import Loading from "../../Layouts/Loading";

const {Title} = Typography

//https://images.unsplash.com/photo-1416339306562-f3d12fefd36f

const Boards = () => {
    const {t} = useTranslation(['app'])

    const dispatch = useDispatch();
    const {boards, loadingBoard} = useSelector(state => state.board);

    const getBoards = () => dispatch(getBoardUserAction())
    const selectBoard = board => dispatch(selectBoardAction(board))

    useEffect(() => {
        selectBoard(null)
        getBoards()
        // eslint-disable-next-line
    }, []);

    if (loadingBoard) return <Loading/>

    return (
        <Layout>
            <div className="container-fluid w-100 bg-container-gray mt-0 pt-0 h-100">
                <div className="container mx-auto pt-lg-5 pt-md-5 pt-xs-4">
                    <div className="row my-lg-3 my-md-5 my-sm-4">
                        <div className="col-6">
                            <Title level={3}>{t('all_boards')}</Title>
                        </div>
                        <div className="col-6 text-right">
                            <NewBoard getBoards={getBoards}/>
                        </div>
                    </div>
                    <div className="row w-100 mx-0">
                        <MotionScreen>
                            {boards.length > 0 && <>
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