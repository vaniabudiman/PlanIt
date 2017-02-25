/*
 * API/fetch() calling structure credit: https://github.com/reactjs/redux/issues/291#issuecomment-122829159
 */
import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    SET: "SET",
    // TODO: testing demonstration only, remove later on
    INC: "INC",

    LOGIN_ATTEMPT: "LOGIN_ATTEMPT",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAILED: "LOGIN_FAILED"
};

export function set (path, value) {
    return {
        type: Types.SET,
        path: path,
        value: value
    };
}

// TODO: testing demonstration only, remove later on
export function inc () {
    return {
        type: Types.INC
    };
}

function dictToFormString (dict) {
    let arr = [];
    for (let key in dict) {
        if (dict.hasOwnProperty(key)) {
            arr.push(key + "=" + dict[key]);
        }
    }
    return arr.join("&");
}

function loginSuccess (response) {
    return dispatch => {
        dispatch({
            response,
            type: Types.LOGIN_SUCCESS,
        });
    };
}

function loginFailed (error) {
    return {
        error,
        type: Types.LOGIN_FAILED,
    };
}

export function login (userData) {
    return dispatch => {
        fetch(apiURL + "login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: dictToFormString({
                userName: userData.userName,
                password: userData.password,
            }),
        })
        .then(response => {
            // console.log(response);
            if (response.status >= 200 && response.status < 300) {
                dispatch(loginSuccess(response));
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                dispatch(loginFailed(error));
                throw error;
            }
        }) // Use another then if you want response.Json()
        .catch(error => {
            // console.log("Request Failed", error);
            alert(error.message); // TODO: remove this and do something with the fetch error
        });};
}
