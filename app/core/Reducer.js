import { Types } from "./Actions.js";
// import update from "re-muatable";    // TODO: find replacement library for this


const initialState = {
    // default initial state
    count: 0, // TODO: testing demonstration only, remove later on
    statusCode: "000",
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.SET:
            // nextState = update.set(nextState, action.path, action.value);
            break;
        // TODO: testing demonstration only, remove later on
        case Types.INC:
            nextState = { ...state, count: state.count += 1 };
            break;
        case Types.FETCH_ATTEMPT:
            nextState = { ...state, statusCode: state.statusCode = "100" };
            break;
        case Types.FETCH_SUCCESS:
            nextState = { ...state, statusCode: state.statusCode = String(action.response.status) };
            break;
        case Types.FETCH_FAILED:
            console.log(action);
            nextState = { ...state, statusCode: state.statusCode = "FAILED" };
            break;
        default:
            return state;
    }
    return nextState;
}