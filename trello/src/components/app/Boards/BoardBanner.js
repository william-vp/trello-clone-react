import React, {Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Avatar, Space, Tooltip} from "antd";
import Loading from "../../Layouts/Loading";
import Page404 from "../../Layouts/Errors/404";
import {UserOutlined} from '@ant-design/icons'
import Settings from "./Settings";
import {getRouteImage} from "../../../utils/format";
import InviteBoard from "./InviteBoard";
import {getBoardMembersAction} from "../../../actions/boardActions";
import {useParams} from "react-router-dom";
import VisibilityBoard from "./VisibilityBoard";

const BoardBanner = () => {
    const {loading, selectedBoard} = useSelector(state => state.board);

    const params = useParams();
    const {boardCode} = params

    const dispatch = useDispatch();
    const {membersSelectedBoard} = useSelector(state => state.board);

    const getMembers = board => dispatch(getBoardMembersAction(board))

    useEffect(() => {
        getMembers(boardCode)
        // eslint-disable-next-line
    }, [boardCode]);

    if (loading) return <Loading/>
    if (!selectedBoard) return <Page404/>

    return (
        <>
            <div className="row w-100 py-5 px-5">
                <div className="col-6 pl-3">
                    <Space size="middle">
                        <VisibilityBoard/>

                        {selectedBoard.user && <Fragment>
                            <Tooltip
                                title={`Admin: ${selectedBoard.user.name ? selectedBoard.user.name : selectedBoard.user.email}`}>
                                {selectedBoard.user.photoUrl ?
                                    <Avatar
                                        size={32} shape="square"
                                        src={getRouteImage(selectedBoard.user.photoUrl, 'users', 'avatar')}/>
                                    : <Avatar shape="square" icon={<UserOutlined/>}/>
                                }
                            </Tooltip>

                            {membersSelectedBoard && <Fragment>
                                {membersSelectedBoard.map((member) => {
                                    return <Tooltip
                                        key={member._id}
                                        title={member.user.name ? member.user.name : member.user.email}>
                                        {member.user.photoUrl ?
                                            <Avatar
                                                size={32} shape="square"
                                                src={getRouteImage(member.user.photoUrl, 'users', 'avatar')}/>
                                            : <Avatar shape="square" icon={<UserOutlined/>}/>}
                                    </Tooltip>
                                })}
                            </Fragment>}
                        </Fragment>}

                        <InviteBoard/>
                    </Space>
                </div>
                <div className="col-6 text-right">
                    {selectedBoard.user && <Settings/>}
                </div>
            </div>
        </>
    );
};
export default BoardBanner;