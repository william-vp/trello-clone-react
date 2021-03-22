import {
    LOADING_BOARD, SET_BOARDS_USER,
    SELECT_BOARD,
    NEW_BOARD,
    UPDATE_BOARD, SET_MEMBERS_SELECTED_BOARD,
    SET_LISTS_BOARD, EDIT_LIST_BOARD,
    DELETE_LIST_BOARD, ADD_LIST_BOARD, DELETE_MEMBER_BOARD,
    SET_ORDER_CARDS_LIST
} from "../types/boardTypes";

const initialState = {
    loadingBoard: false,
    boards: [],
    selectedBoard: null,
    membersSelectedBoard: null,
    listsSelectedBoard: null,
    orderCardsList: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_BOARD:
            return {
                ...state,
                loadingBoard: action.payload
            }
        case SET_BOARDS_USER:
            return {
                ...state,
                boards: action.payload
            }
        case SELECT_BOARD:
            return {
                ...state,
                selectedBoard: action.payload
            }
        case SET_MEMBERS_SELECTED_BOARD:
            return {
                ...state,
                membersSelectedBoard: action.payload
            }
        case SET_ORDER_CARDS_LIST:
            return {
                ...state,
                orderCardsList: action.payload
            }
        case UPDATE_BOARD:
            return {
                ...state,
                boards: state.boards.map(board => board._id === action.payload._id ? action.payload : board),
            }
        case NEW_BOARD:
            return {
                ...state,
                boards: [action.payload, ...state.boards]
            }
        case SET_LISTS_BOARD:
            return {
                ...state,
                listsSelectedBoard: action.payload
            }
        case ADD_LIST_BOARD:
            return {
                ...state,
                listsSelectedBoard: [...state.listsSelectedBoard, action.payload],
            }
        case EDIT_LIST_BOARD:
            return {
                ...state,
                listsSelectedBoard: state.listsSelectedBoard.map(list => list._id === action.payload._id ? action.payload : list),
            }
        case DELETE_LIST_BOARD:
            return {
                ...state,
                listsSelectedBoard: state.listsSelectedBoard.filter(list => list._id !== action.payload),
            }
        case DELETE_MEMBER_BOARD:
            return {
                ...state,
                membersSelectedBoard: state.membersSelectedBoard.filter(member => member._id !== action.payload),
            }
        default:
            return state;
    }
}
