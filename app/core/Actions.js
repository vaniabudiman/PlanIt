/*
 * API/fetch() calling structure credit: https://github.com/reactjs/redux/issues/291#issuecomment-122829159
 */
import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    SET: "SET",
    // TODO: testing demonstration only, remove later on
    INC: "INC",

    FETCH_ATTEMPT: "FETCH_ATTEMPT",
    FETCH_SUCCESS: "FETCH_SUCCESS",
    FETCH_FAILED: "FETCH_FAILED"
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

function fetchAttempt () {
    return {
        type: Types.FETCH_ATTEMPT,
    };
}

function fetchSuccess (response) {
    return dispatch => {
        dispatch({
            response,
            type: Types.FETCH_SUCCESS,
        });
    };
}

function fetchFailed (error) {
    return {
        error,
        type: Types.FETCH_FAILED,
    };
}

export function login (loginData) {
    return dispatch => {
        dispatch(fetchAttempt());
        fetch(apiURL + "login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: loginData.userName,
                password: loginData.password,
            }),
        })
        .then(response => { // Header response.
            // console.log(response);
            if (response.status >= 200 && response.status < 300) {
                dispatch(fetchSuccess(response));
                alert("Login Success. Hello " + loginData.userName + "!")
            } else {
                const error = new Error();
                error.response = response;
                dispatch(fetchFailed(error));
                throw error;
            }
        }) // Use another then if you want the body json response.
        .catch(error => {
            // console.log("Request Failed", error);
            alert("Login Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });};
}
