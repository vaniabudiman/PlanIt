import { Types } from "../actions/attractionsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


const initialState = {
    attractions: [],
    attractionsGETStatus: "",
    nextPageToken: ""
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_ATTRACTIONS_ATTEMPT:
            nextState = { ...state, attractionsGETStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_ATTRACTIONS_SUCCESS:
            nextState = {
                ...state,
                attractionsGETStatus: FETCH_STATUS.SUCCESS,
                attractions: state.nextPageToken === ""
                    ? action.attractions
                    : state.attractions.concat(action.attractions),
                nextPageToken: action.nextPageToken
            };
            break;
        case Types.GET_ATTRACTIONS_FAILED:
            nextState = { ...state, attractionsGETStatus: FETCH_STATUS.FAILED };
            break;
        case Types.CLEAR_ATTRACTIONS_PAGE_TOKEN:
            nextState = { ...state, nextPageToken: "" };
            break;
        default:
            return state;
    }
    return nextState;
}