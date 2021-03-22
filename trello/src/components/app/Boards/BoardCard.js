import React, {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {SharedElement, MotionScene, useMotion} from 'react-motion-layout';
import {Card, Typography} from "antd";
import {useDispatch,} from "react-redux";
import {selectBoardAction} from "../../../actions/boardActions";

const {Text} = Typography

const BoardCard = ({board}) => {
    const history = useHistory();
    const withTransition = useMotion(`board-${board.code}`);
    // eslint-disable-next-line
    const callback = useCallback(() => {
        selectBoard(board)
        history.push(`/board/${board.code}`)
    });

    const dispatch = useDispatch();
    const selectBoard = board => dispatch(selectBoardAction(board))

    return (
        <MotionScene name={`board-${board.code}`} onClick={withTransition(callback)}>
            <Card
                hoverable
                bodyStyle={{padding: '12px', paddingBottom: '20px'}}
                bordered={false}
                className="card-board mb-2">
                <SharedElement.Image
                    animationKey="big-image"
                    alt="example" className="w-100 card-image"
                    src={board.coverUrl}/>
                <SharedElement.Text animationKey="text-main">
                    <Text className="card-board-title my-4"> {board.name}</Text>
                </SharedElement.Text>
            </Card>
        </MotionScene>
    );
};
export default BoardCard;