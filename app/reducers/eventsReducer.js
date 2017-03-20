import { Types } from "../actions/eventsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { clone } from "underscore";


const initialState = {
    events: [],
    eventsGETStatus: "",
    eventDELETEStatus: "",
    eventPOSTStatus: "",
    eventPUTStatus: "",
    refresh: false
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_EVENTS_ATTEMPT:
            nextState = { ...state, eventsGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_EVENTS_SUCCESS:
            nextState = { ...state, eventsGETStatus: FETCH_STATUS.SUCCESS, events: action.events, refresh: false };
            break;
        case Types.GET_EVENTS_FAILED:
            nextState = { ...state, eventsGETStatus: FETCH_STATUS.FAILED };
            break;
        case Types.CREATE_EVENT_ATTEMPT:
            nextState = { ...state, eventPOSTStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.CREATE_EVENT_SUCCESS:
            nextState = { ...state, eventPOSTStatus: FETCH_STATUS.SUCCESS, event: action.event, refresh: true };
            break;
        case Types.CREATE_EVENT_FAILED:
            nextState = { ...state, eventPOSTStatus: FETCH_STATUS.FAILED };
            break;
        case Types.DELETE_EVENT_ATTEMPT:
            nextState = { ...state, eventDELETEStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.DELETE_EVENT_SUCCESS:
            nextState = {
                ...state,
                eventDELETEStatus: FETCH_STATUS.SUCCESS,
                // find & remove the deleted event from the current list of events
                // clone to return a new array so React picks up change & re-renders the updated events list
                events: clone(state.events).filter((event) => event.eventID !== action.eventId)
            };
            break;
        case Types.DELETE_EVENT_FAILED:
            nextState = { ...state, eventDELETEStatus: FETCH_STATUS.FAILED };
            break;
        case Types.UPDATE_EVENT_ATTEMPT:
            nextState = { ...state, eventPUTStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.UPDATE_EVENT_SUCCESS:
            nextState = { ...state, eventPUTStatus: FETCH_STATUS.SUCCESS, refresh: true };
            break;
        case Types.UPDATE_EVENT_FAILED:
            nextState = { ...state, eventPUTStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}