import { Types } from "../actions/bookmarksActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { clone } from "underscore";


const initialState = {
    bookmarks: [],
    bookmarksGETStatus: "",
    bookmarksDELETEStatus: ""
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
        case Types.DELETE_BOOKMARKS_ATTEMPT:
            nextState = { ...state, bookmarksDELETEStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.DELETE_BOOKMARKS_SUCCESS:
            nextState = {
                ...state,
                bookmarksDELETEStatus: FETCH_STATUS.SUCCESS,
                // find & remove the deleted bookmark from the current list of bookmarks
                // clone to return a new array so React picks up change & re-renders the updated bookmarks list
                bookmarks: clone(state.bookmarks).filter((bookmark) => bookmark.bookmarkID !== action.bookmarkId)
            };
            break;
        case Types.DELETE_BOOKMARKS_FAILED:
            nextState = { ...state, bookmarksDELETEStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}