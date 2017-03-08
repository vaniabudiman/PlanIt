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

function loginSuccess () {
    return {
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

function signupSuccess () {
    return {
        type: Types.SIGNUP_SUCCESS,
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
        if (loginData.userName === "") { return (alert("Please enter your Username!")); }
        if (loginData.password === "") { return (alert("Please enter your Password!")); }
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
                dispatch(loginSuccess());
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
        if (signupData.name === "") { return (alert("Please enter a Name!")); }
        if (signupData.userName === "") { return (alert("Please enter a Username!")); }
        if (signupData.email === "") { return (alert("Please enter an Email!")); }
        if (signupData.password === "") { return (alert("Please enter a Password!")); }
        if (signupData.homeCurrency === "") { return (alert("Please select a Home Currency!")); }
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
                dispatch(signupSuccess());
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