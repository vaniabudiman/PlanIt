import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    LOGIN_ATTEMPT: "LOGIN_ATTEMPT",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAILED: "LOGIN_FAILED",
    SIGNUP_ATTEMPT: "SIGNUP_ATTEMPT",
    SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
    SIGNUP_FAILED: "SIGNUP_FAILED",
};

function loginAttempt () {
    return {
        type: Types.LOGIN_ATTEMPT
    };
}

function loginSuccess (response) {
    return {
        response,
        type: Types.LOGIN_SUCCESS
    };
}

function loginFailed (error) {
    return {
        error,
        type: Types.LOGIN_FAILED
    };
}

function signupAttempt () {
    return {
        type: Types.SIGNUP_ATTEMPT
    };
}

function signupSuccess (response) {
    return dispatch => {
        dispatch({
            response,
            type: Types.SIGNUP_SUCCESS,
        });
    };
}

function signupFailed (error) {
    return {
        error,
        type: Types.SIGNUP_FAILED,
    };
}

export function login (loginData) {
    return dispatch => {
        dispatch(loginAttempt());
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
                dispatch(loginSuccess(response));
                alert("Login Success. Hello " + loginData.userName + "!");
            } else {
                const error = new Error();
                error.response = response;
                dispatch(loginFailed(error));
                throw error;
            }
        })
        .catch(error => {
            // console.log("Request Failed", error);
            alert("Login Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });
    };
}

export function signup (signupData) {
    return dispatch => {
        dispatch(signupAttempt());
        fetch(apiURL + "users", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: signupData.userName,
                password: signupData.password,
                name: signupData.name,
                email: signupData.email,
                homeCurrency: signupData.homeCurrency,
            }),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                dispatch(signupSuccess(response));
                alert("Signup Success. Try logging in now " + signupData.userName + "!");
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(signupFailed(error));
                throw error;
            }
            // return response.json() and use another .then (see commented out below) if you want the body json response.
        })
        // .then(response => {
        //     // json response of newly created User object is here
        // })
        .catch(error => {
            // console.log("Request Failed", error);
            alert("Signup Failed: " + error.response.status);
        });
    };
}