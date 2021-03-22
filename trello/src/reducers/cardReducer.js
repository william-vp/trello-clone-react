import {
    ADD_CARD, DELETE_CARD, EDIT_CARD,
    LOADING_CARD, SET_CARDS
} from "../types/boardTypes";

const initialState = {
    loadingCard: false,
    cards: [],
    selectedCard: null,
    membersCard: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_CARD:
            return {
                ...state,
                loadingBoard: action.payload
            }
        case ADD_CARD:
            return {
                ...state,
                cards: [action.payload, ...state.cards]
            }
        case SET_CARDS:
            return {
                ...state,
                listsSelectedBoard: action.payload
            }
        case EDIT_CARD:
            return {
                ...state,
                listsSelectedBoard: state.listsSelectedBoard.map(list => list._id === action.payload._id ? action.payload : list),
            }
        case DELETE_CARD:
            return {
                ...state,
                listsSelectedBoard: state.listsSelectedBoard.filter(list => list._id !== action.payload),
            }
        default:
            return state;
    }
}
