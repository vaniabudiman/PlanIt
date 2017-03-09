import { Types } from "../actions/accountActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


const initialState = {
    loginStatus: "",
    signupStatus: "",
    getUserStatus: "",
    putUserStatus: "",
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        // /login POST
        case Types.LOGIN_ATTEMPT:
            nextState = { ...state, loginStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.LOGIN_SUCCESS:
            nextState = { ...state, loginStatus: FETCH_STATUS.SUCCESS };
            break;
        case Types.LOGIN_FAILED:
            nextState = { ...state, loginStatus: FETCH_STATUS.FAILED };
            break;
        // /users POST
        case Types.SIGNUP_ATTEMPT:
            nextState = { ...state, signupStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.SIGNUP_SUCCESS:
            nextState = { ...state, signupStatus: FETCH_STATUS.SUCCESS };
            break;
        case Types.SIGNUP_FAILED:
            nextState = { ...state, signupStatus: FETCH_STATUS.FAILED };
            break;
        // /users GET
        case Types.GET_USER_ATTEMPT:
            nextState = { ...state, getUserStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.GET_USER_SUCCESS:
            nextState = { ...state, getUserStatus: FETCH_STATUS.SUCCESS };
            break;
        case Types.GET_USER_FAILED:
            nextState = { ...state, getUserStatus: FETCH_STATUS.FAILED };
            break;
        // /users PUT
        case Types.PUT_USER_ATTEMPT:
            nextState = { ...state, putUserStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.PUT_USER_SUCCESS:
            nextState = { ...state, putUserStatus: FETCH_STATUS.SUCCESS };
            break;
        case Types.PUT_USER_FAILED:
            nextState = { ...state, putUserStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}