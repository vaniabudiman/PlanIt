import { Types } from "../actions/attractionsActions.js";


const initialState = {
    items: [],
    attractionsStatusCode: "000",
    pageToken: ""
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.GET_ATTRACTIONS_ATTEMPT:
            nextState = { ...state, attractionsStatusCode: "FETCHING_ATTRACTIONS" };
            break;
        case Types.GET_ATTRACTIONS_SUCCESS:
            nextState = { ...state, attractionsStatusCode: "OK", items: action.items, pageToken: action.pageToken };
            break;
        case Types.GET_ATTRACTIONS_FAILED:
            nextState = { ...state, attractionsStatusCode: "FAILED" };
            break;
        case Types.CLEAR_ATTRACTIONS_PAGE_TOKEN:
            nextState = { ...state, pageToken: "" };
            break;
        default:
            return state;
    }
    return nextState;
}