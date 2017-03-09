import { Types } from "../actions/tripsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


const initialState = {
    trip: {},
    trips: [],
    tripsGETStatus: "",
    tripPOSTStatus: ""
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_TRIPS_ATTEMPT:
            nextState = { ...state, tripsGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_TRIPS_SUCCESS:
            nextState = { ...state, tripsGETStatus: FETCH_STATUS.SUCCESS, trips: action.trips };
            break;
        case Types.GET_TRIPS_FAILED:
            nextState = { ...state, tripsGETStatus: FETCH_STATUS.FAILED };
            break;
        case Types.CREATE_TRIP_ATTEMPT:
            nextState = { ...state, tripPOSTStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.CREATE_TRIP_SUCCESS:
            nextState = { ...state, tripPOSTStatus: FETCH_STATUS.SUCCESS, trip: action.trip };
            break;
        case Types.CREATE_TRIP_FAILED:
            nextState = { ...state, tripPOSTStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}