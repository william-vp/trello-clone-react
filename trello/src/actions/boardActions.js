import {
    NEW_BOARD,
    LOADING_BOARD, SELECT_BOARD,
    SET_BOARDS_USER, UPDATE_BOARD,
    SET_MEMBERS_SELECTED_BOARD,
    SET_LISTS_BOARD, EDIT_LIST_BOARD,
    DELETE_LIST_BOARD, ADD_LIST_BOARD, DELETE_MEMBER_BOARD, 
    SET_ORDER_CARDS_LIST
} from "../types/boardTypes";

import axios from "../config/axios";
import {openInfoMessage} from "../components/app/Auth/Alert";
import {openNotification} from "../utils/alerts";
import tokenAuth from "../config/tokenAuth";

/**Actions **/
export function selectBoardAction(board) {
    return async (dispatch) => {
        dispatch(selectBoard(board))
    }
}

export function setListsBoardAction(boardCode) {
    return async (dispatch) => {
        const response = await axios.get(`/api/boards/${boardCode}`);
        if (response.data.lists) {
            dispatch(setListsBoard(response.data.lists))
        }
    }
}

export function addListBoardAction(boardCode, name) {
    return async (dispatch) => {
        const response = await axios.post(`/api/lists/${boardCode}`, {name});
        if (response.data.list) dispatch(addListBoard(response.data.list))
    }
}

export function editListBoardAction(id, name) {
    return async (dispatch) => {
        const response = await axios.put(`/api/lists/${id}`, {name});
        if (response.data.list) {
            dispatch(editListBoard(response.data.list))
        }
    }
}

export function getBoardUserAction() {
    return async (dispatch) => {
        try {
            dispatch(loading(true))
            const response = await axios.get('/api/boards');
            if (response.data.boards) dispatch(setBoardsUser(response.data.boards))
        } catch (e) {

        }
        dispatch(loading(false))
    }
}

export function getBoardAction(boardCode) {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) tokenAuth(token)
            const response = await axios.get(`/api/boards/${boardCode}`);
            if (response.data.board) {
                dispatch(selectBoard(response.data.board))
            }
        } catch (e) {
        }
        dispatch(loading(false))
    }
}

export function deleteListBoardAction(id) {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`/api/lists/${id}`);
            if (response.data.success) dispatch(deleteListBoard(id))
        } catch (e) {
        }
        dispatch(loading(false))
    }
}

export function getBoardMembersAction(code) {
    return async (dispatch) => {
        try {
            dispatch(loading(true))
            const response = await axios.get(`/api/members/${code}`);
            if (response.data.members) dispatch(setBoardMembers(response.data.members))
        } catch (e) {
            openInfoMessage('warnign', "Eror mostrando los miembros del tablero")
        }
        dispatch(loading(false))
    }
}

export function deleteMemberBoardAction(memberId) {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`/api/members/${memberId}`);
            if (response.data.success) dispatch(deleteMemberBoard(memberId))
        } catch (e) {
        }
        dispatch(loading(false))
    }
}

export function updateBoardAction(id, board) {
    return async (dispatch) => {
        try {
            dispatch(loading(true))
            const response = await axios.put(`/api/boards/${id}`, board);
            dispatch(selectBoard(response.data.board))
            dispatch(updateBoard(response.data.board))
            openInfoMessage('Tablero actalizado correctamente', 'success')
        } catch (e) {
        }
        dispatch(loading(false))
    }
}

export function createBoardAction(board) {
    return async (dispatch) => {
        try {
            console.log(board)
            dispatch(loading(true))
            const response = await axios.post(`/api/boards`, board);
            if (response.data.board) {
                dispatch(newBoard(response.data.board))
                openNotification("Correcto", "Tablero creado correctamente", "success")
            }
        } catch (e) {
        }
        dispatch(loading(false))
    }
}


export function setOrderCardsListAction(order) {
    return async (dispatch) => {
        try {
            dispatch(setOrderCardsList(order))
        } catch (e) {
        }
    }
}

/** Dispatchs **/

const setOrderCardsList = order => ({
    type: SET_ORDER_CARDS_LIST, payload: order
});

const loading = state => ({
    type: LOADING_BOARD, payload: state
});

const setBoardsUser = payload => ({
    type: SET_BOARDS_USER, payload
});

const setBoardMembers = payload => ({
    type: SET_MEMBERS_SELECTED_BOARD, payload
});

const selectBoard = payload => ({
    type: SELECT_BOARD, payload
});

const newBoard = payload => ({
    type: NEW_BOARD, payload
});

const updateBoard = payload => ({
    type: UPDATE_BOARD, payload
});

const setListsBoard = payload => ({
    type: SET_LISTS_BOARD, payload
});

const addListBoard = payload => ({
    type: ADD_LIST_BOARD, payload
});

const editListBoard = payload => ({
    type: EDIT_LIST_BOARD, payload
});

const deleteListBoard = payload => ({
    type: DELETE_LIST_BOARD, payload
});

const deleteMemberBoard = payload => ({
    type: DELETE_MEMBER_BOARD, payload
});