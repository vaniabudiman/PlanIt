import { Types } from "../actions/accountActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";

const initialState = {
    loginStatus: "",
    signupStatus: "",
    getUserStatus: "",
    putUserStatus: "",
    userData: getDefaultUserData(),
};

export function getDefaultUserData (userName = "", password = "", name = "",
                             email = "", homeCurrency = "") {
    return [
        { id: 1, title: "Username", placeholder: "placeholder 1", value: userName, readOnly: true },
        { id: 2, title: "Password", placeholder: "placeholder 2", value: password },
        { id: 3, title: "Name", placeholder: "placeholder 3", value: name },
        { id: 4, title: "Email", placeholder: "placeholder 4", value: email },
        { id: 5, title: "Home Currency", placeholder: "placeholder 5", value: homeCurrency }
    ];
}

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
            nextState = {
                ...state,
                getUserStatus: FETCH_STATUS.SUCCESS,
                userData: getDefaultUserData(action.user.userName, action.user.password, action.user.name,
                    action.user.email, action.user.homeCurrency),
            };
            break;
        case Types.GET_USER_FAILED:
            nextState = { ...state, getUserStatus: FETCH_STATUS.FAILED };
            break;
        // /users PUT
        case Types.PUT_USER_ATTEMPT:
            nextState = { ...state, putUserStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.PUT_USER_SUCCESS:
            nextState = {
                ...state,
                putUserStatus: FETCH_STATUS.SUCCESS,
                userData: getDefaultUserData(action.user.userName, action.user.password, action.user.name,
                    action.user.email, action.user.homeCurrency),
            };
            break;
        case Types.PUT_USER_FAILED:
            nextState = { ...state, putUserStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}