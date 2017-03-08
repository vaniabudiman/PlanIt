import { Types } from "../actions/citiesActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


const initialState = {
    cities: [],
    citiesGETStatus: ""
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_CITIES_ATTEMPT:
            nextState = { ...state, citiesGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_CITIES_SUCCESS:
            nextState = { ...state, citiesGETStatus: FETCH_STATUS.SUCCESS, cities: action.cities };
            break;
        case Types.GET_CITIES_FAILED:
            nextState = { ...state, citiesGETStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}