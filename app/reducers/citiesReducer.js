import { Types } from "../actions/citiesActions.js";


const initialState = {
    items: [],
    citiesStatusCode: "000"
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_CITIES_ATTEMPT:
            nextState = { ...state, citiesStatusCode: "FETCHING_CITIES" };
            break;
        case Types.GET_CITIES_SUCCESS:
            nextState = { ...state, citiesStatusCode: "OK", items: action.items };
            break;
        case Types.GET_CITIES_FAILED:
            nextState = { ...state, citiesStatusCode: "FAILED" };
            break;
        default:
            return state;
    }
    return nextState;
}