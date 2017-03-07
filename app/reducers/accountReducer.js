import { Types } from "../actions/accountActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


const initialState = {
    loginStatus: "",
    signupStatus: "",
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.LOGIN_ATTEMPT:
            nextState = { ...state, loginStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.LOGIN_SUCCESS:
            nextState = { ...state, loginStatus: FETCH_STATUS.SUCCESS };
            break;
        case Types.LOGIN_FAILED:
            nextState = { ...state, loginStatus: FETCH_STATUS.FAILED };
            break;
        case Types.SIGNUP_ATTEMPT:
            nextState = { ...state, signupStatus: FETCH_STATUS.ATTEMPTING };
            break;
        case Types.SIGNUP_SUCCESS:
            nextState = { ...state, signupStatus: FETCH_STATUS.SUCCESS };
            break;
        case Types.SIGNUP_FAILED:
            nextState = { ...state, signupStatus: FETCH_STATUS.FAILED };
            break;
        default:
            return state;
    }
    return nextState;
}