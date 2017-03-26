import { Types } from "../actions/transportationActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


const initialState = {
    transportations: [],
    transportation: {},
    transportationGETStatus: "",
    transportationDetailsGETStatus: "",
    transportationDELETEStatus: "",
    transportationPOSTStatus: "",
    transportationPUTStatus: "",
    refresh: false
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_TRANSPORTATION_ATTEMPT:
            nextState = { ...state, transportationGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_TRANSPORTATION_SUCCESS:
            nextState = { ...state, transportationGETStatus: FETCH_STATUS.SUCCESS,
                transportations: action.transportations, refresh: false };
            break;
        case Types.GET_TRANSPORTATION_FAILED:
            nextState = { ...state, transportationGETStatus: FETCH_STATUS.FAILED };
            break;
        case Types.GET_TRANSPORTATION_DETAILS_ATTEMPT:
            nextState = { ...state, transportationDetailsGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_TRANSPORTATION_DETAILS_SUCCESS:
            nextState = { ...state, transportationDetailsGETStatus: FETCH_STATUS.SUCCESS,
                transportation: action.transportation, refresh: false };
            break;
        case Types.GET_TRANSPORTATION_DETAILS_FAILED:
            nextState = { ...state, transportationDetailsGETStatus: FETCH_STATUS.FAILED };
            break;
        case Types.CREATE_TRANSPORTATION_ATTEMPT:
            nextState = { ...state, transportationPOSTStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.CREATE_TRANSPORTATION_SUCCESS:
            nextState = { ...state, transportationPOSTStatus: FETCH_STATUS.SUCCESS,
                transportation: action.transportation, refresh: true };
            break;
        case Types.CREATE_TRANSPORTATION_FAILED:
            nextState = { ...state, transportationPOSTStatus: FETCH_STATUS.FAILED };
            break;
        case Types.DELETE_TRANSPORTATION_ATTEMPT:
            nextState = { ...state, transportationDELETEStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.DELETE_TRANSPORTATION_SUCCESS:
            nextState = { ...state, transportationDELETEStatus: FETCH_STATUS.SUCCESS, refresh: true };
            break;
        case Types.DELETE_TRANSPORTATION_FAILED:
            nextState = { ...state, transportationDELETEStatus: FETCH_STATUS.FAILED };
            break;
        case Types.UPDATE_TRANSPORTATION_ATTEMPT:
            nextState = { ...state, transportationPUTStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.UPDATE_TRANSPORTATION_SUCCESS:
            nextState = { ...state, transportationPUTStatus: FETCH_STATUS.SUCCESS,
                transportation: action.transportation, refresh: true };
            break;
        case Types.UPDATE_TRANSPORTATION_FAILED:
            nextState = { ...state, transportationPUTStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}