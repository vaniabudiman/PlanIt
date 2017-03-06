import { Types } from "./Actions.js";
// import update from "re-muatable";    // TODO: find replacement library for this


const initialState = {
    // default initial state
    count: 0, // TODO: testing demonstration only, remove later on
    loginStatusCode: "000",
    signupStatusCode: "000",
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
        case Types.LOGIN_SUCCESS:
            nextState = { ...state, loginStatusCode: state.loginStatusCode = String(action.response.status) };
            break;
        case Types.LOGIN_FAILED:
            nextState = { ...state, loginStatusCode: state.loginStatusCode = "FAILED" };
            break;
        case Types.SIGNUP_SUCCESS:
            nextState = { ...state, signupStatusCode: state.signupStatusCode = String(action.response.status) };
            break;
        case Types.SIGNUP_FAILED:
            nextState = { ...state, signupStatusCode: state.signupStatusCode = "FAILED" };
            break;
        default:
            return state;
    }
    return nextState;
}