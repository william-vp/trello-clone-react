import React, {Fragment} from 'react';
import {Button, Card, Popover, Tooltip, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Lock as LockIcon, LockOpen as LockOpenIcon, Public as PublicIcon} from '@material-ui/icons';
import {updateBoardAction} from "../../../actions/boardActions";

const {Text, Paragraph} = Typography
const {Meta} = Card

const VisibilityBoard = () => {
    const {t} = useTranslation(['app', 'board'])

    const dispatch = useDispatch();
    const {selectedBoard} = useSelector(state => state.board);
    const updateBoard = (id, board) => dispatch(updateBoardAction(id, board))

    const {visibility} = selectedBoard

    const submitVisibility = async (visibility) => {
        if (selectedBoard.visibility === visibility) return false;
        updateBoard(selectedBoard._id, {visibility})
    }

    return (
        <Fragment>
            <Popover
                placement="bottomLeft"
                content={<Fragment>
                    <Text strong>{t('visibility_message')}</Text>
                    <Paragraph className="text-muted">
                        {t('visibility_description')}
                    </Paragraph>
                    <Paragraph className="mb-2">
                        <Button
                            onClick={() => submitVisibility('public')}
                            block ghost
                            className={visibility === 'public' ? 'btn-visibility active-meta' : 'btn-visibility'}>
                            <Meta
                                avatar={<PublicIcon className="m-icon"/>}
                                title={<Fragment>
                                    <Text strong className="title-meta">{t('public_label')} </Text>
                                    <Paragraph className="desc-meta">{t('board:public_description')}</Paragraph>
                                </Fragment>}
                            />
                        </Button>
                    </Paragraph>
                    <Paragraph className="mt-0">
                        <Button
                            onClick={() => submitVisibility('private')}
                            block ghost
                            className={visibility === 'private' ? 'btn-visibility active-meta' : 'btn-visibility'}>
                            <Meta
                                avatar={<LockIcon className="m-icon"/>}
                                title={<Fragment>
                                    <Text strong className="title-meta">{t('private_label')} </Text>
                                    <Paragraph className="desc-meta">{t('board:private_description')}</Paragraph>
                                </Fragment>}
                            />
                        </Button>
                    </Paragraph>
                </Fragment>}
                trigger="click">
                <Tooltip title={t('visibility_message')}>
                    <Button
                        icon={visibility === 'public' ? <LockOpenIcon className="m-icon"/> :
                            <LockIcon className="m-icon"/>}
                        type="primary" size="middle"
                        //className={!visibility ? "bg-gray border-0 rounded-lg p-1 text-gray px-3" : "border-0 rounded-lg p-1 px-3"}>
                        className="btn-gray">
                        {visibility === 'public' ? t('public_label') : t('private_label')}
                    </Button>
                </Tooltip>
            </Popover>
        </Fragment>
    );
};
export default VisibilityBoard;