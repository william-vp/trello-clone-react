import {combineReducers} from 'redux';
import boardReducer from "./boardReducer";
import cardReducer from "./cardReducer";

export default combineReducers({
    board: boardReducer,
    card: cardReducer
})