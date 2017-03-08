import { Types } from "../actions/bookmarksActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


const initialState = {
    bookmarks: [],
    bookmarksGETStatus: ""
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_BOOKMARKS_ATTEMPT:
            nextState = { ...state, bookmarksGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_BOOKMARKS_SUCCESS:
            nextState = { ...state, bookmarksGETStatus: FETCH_STATUS.SUCCESS, bookmarks: action.bookmarks };
            break;
        case Types.GET_BOOKMARKS_FAILED:
            nextState = { ...state, bookmarksGETStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}