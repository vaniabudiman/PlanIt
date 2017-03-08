import { Types } from "../actions/eventsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


const initialState = {
    events: [],
    eventsGETStatus: ""
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_EVENTS_ATTEMPT:
            nextState = { ...state, eventsGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_EVENTS_SUCCESS:
            nextState = { ...state, eventsGETStatus: FETCH_STATUS.SUCCESS, events: action.events };
            break;
        case Types.GET_EVENTS_FAILED:
            nextState = { ...state, eventsGETStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}