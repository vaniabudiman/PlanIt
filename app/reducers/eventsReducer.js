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
        case Types.DELETE_EVENTS_ATTEMPT:
            nextState = { ...state, eventsDELETEStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.DELETE_EVENTS_SUCCESS:
            nextState = {
                ...state,
                eventsDELETEStatus: FETCH_STATUS.SUCCESS,
                // find & remove the deleted event from the current list of events
                // clone to return a new array so React picks up change & re-renders the updated events list
                events: clone(state.events).filter((event) => event.eventID !== action.eventId)
            };
            break;
        case Types.DELETE_EVENTS_FAILED:
            nextState = { ...state, eventsDELETEStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}