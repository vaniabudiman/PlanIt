import { Types } from "./Actions.js";
// import update from "re-muatable";    // TODO: find replacement library for this


const initialState = {
    // default initial state
    count: 0, // TODO: testing demonstration only, remove later on
    TEST: "standby", // TODO: testing rest api call status, remove later on
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
        case Types.LOGIN_SUCCESS:
            // TODO: do something with login success:
            nextState = { ...state, TEST: state.TEST = String(action.response.status) };
            break;
        case Types.LOGIN_FAILED:
            // TODO: do something with login failed:
            nextState = { ...state, TEST: state.TEST = "FAILED" };
            break;
        default:
            return state;
    }
    return nextState;
}