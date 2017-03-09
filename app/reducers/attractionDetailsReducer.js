import { Types } from "../actions/attractionDetailsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


const initialState = {
    details: null,
    attractionDetailsGETStatus: "",
    nextPageToken: ""
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_ATTRACTION_DETAILS_ATTEMPT:
            nextState = { ...state, attractionDetailsGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_ATTRACTION_DETAILS_SUCCESS:
            nextState = { ...state, attractionDetailsGETStatus: FETCH_STATUS.SUCCESS, details: action.details };
            break;
        case Types.GET_ATTRACTION_DETAILS_FAILED:
            nextState = { ...state, attractionDetailsGETStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}