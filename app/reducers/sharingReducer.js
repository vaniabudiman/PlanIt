import { Types } from "../actions/sharingActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";

const initialState = {
    count: 0,
    sharedEvents: [],
    sharedBookmarks: [],

    sharedGETStatus: "",
    sharedPUTStatus: "",
    sharedPOSTStatus: "",
    sharedDELETEStatus: "",
    refresh: false
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_SHARED_ATTEMPT:
            nextState = { ...state, sharedGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_SHARED_SUCCESS:
            nextState = {
                ...state,
                sharedGETStatus: FETCH_STATUS.SUCCESS,
                count: action.events.length + action.bookmarks.length,
                sharedEvents: action.events,
                sharedBookmarks: action.bookmarks,
                refresh: false
            };
            break;
        case Types.GET_SHARED_FAILED:
            nextState = { ...state, sharedGETStatus: FETCH_STATUS.FAILED };
            break;
        case Types.CREATE_SHARED_ATTEMPT:
            nextState = { ...state, sharedPOSTStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.CREATE_SHARED_SUCCESS:
            nextState = { ...state, sharedPOSTStatus: FETCH_STATUS.SUCCESS };
            break;
        case Types.CREATE_SHARED_FAILED:
            nextState = { ...state, sharedPOSTStatus: FETCH_STATUS.FAILED };
            break;
        case Types.DELETE_SHARED_ATTEMPT:
            nextState = { ...state, sharedDELETEStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.DELETE_SHARED_SUCCESS:
            nextState = { ...state, sharedDELETEStatus: FETCH_STATUS.SUCCESS, refresh: true };
            break;
        case Types.DELETE_SHARED_FAILED:
            nextState = { ...state, sharedDELETEStatus: FETCH_STATUS.FAILED };
            break;
        case Types.UPDATE_SHARED_ATTEMPT:
            nextState = { ...state, sharedPUTStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.UPDATE_SHARED_SUCCESS:
            nextState = { ...state, sharedPUTStatus: FETCH_STATUS.SUCCESS, refresh: true };
            break;
        case Types.UPDATE_SHARED_FAILED:
            nextState = { ...state, sharedPUTStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}