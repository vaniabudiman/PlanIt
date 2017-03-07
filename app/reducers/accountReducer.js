import { Types } from "../actions/accountActions.js";


const initialState = {
    loginStatusCode: "000",
    signupStatusCode: "000",
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.LOGIN_ATTEMPT:
            nextState = { ...state, loginStatusCode: state.statusCode = "100" };
            break;
        case Types.LOGIN_SUCCESS:
            nextState = { ...state, loginStatusCode: state.loginStatusCode = String(action.response.status) };
            break;
        case Types.LOGIN_FAILED:
            nextState = { ...state, loginStatusCode: state.loginStatusCode = "FAILED" };
            break;
        case Types.SIGNUP_ATTEMPT:
            nextState = { ...state, signupStatusCode: state.statusCode = "100" };
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