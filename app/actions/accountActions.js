import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    LOGIN_ATTEMPT: "LOGIN_ATTEMPT",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAILED: "LOGIN_FAILED",

    SIGNUP_ATTEMPT: "SIGNUP_ATTEMPT",
    SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
    SIGNUP_FAILED: "SIGNUP_FAILED",

    GET_USER_ATTEMPT: "GET_USER_ATTEMPT",
    GET_USER_SUCCESS: "GET_USER_SUCCESS",
    GET_USER_FAILED: "GET_USER_FAILED",

    PUT_USER_ATTEMPT: "PUT_USER_ATTEMPT",
    PUT_USER_SUCCESS: "PUT_USER_SUCCESS",
    PUT_USER_FAILED: "PUT_USER_FAILED",

    DELETE_USER_ATTEMPT: "DELETE_USER_ATTEMPT",
    DELETE_USER_SUCCESS: "DELETE_USER_SUCCESS",
    DELETE_USER_FAILED: "DELETE_USER_FAILED",
};

// /login POST
function loginAttempt () { return { type: Types.LOGIN_ATTEMPT }; }
function loginSuccess () { return { type: Types.LOGIN_SUCCESS }; }
function loginFailed (error) { return { error, type: Types.LOGIN_FAILED }; }

// /users POST
function signupAttempt () { return { type: Types.SIGNUP_ATTEMPT }; }
function signupSuccess () { return { type: Types.SIGNUP_SUCCESS }; }
function signupFailed (error) { return { error, type: Types.SIGNUP_FAILED }; }

// /users GET
function getUserAttempt () { return { type: Types.GET_USER_ATTEMPT }; }
function getUserSuccess (response) { return { user: response.user, type: Types.GET_USER_SUCCESS }; }
function getUserFailed (error) { return { error, type: Types.GET_USER_FAILED }; }

// /users PUT
function putUserAttempt () { return { type: Types.PUT_USER_ATTEMPT }; }
function putUserSuccess (response) { return { user: response.user, type: Types.PUT_USER_SUCCESS }; }
function putUserFailed (error) { return { error, type: Types.PUT_USER_FAILED }; }

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
        .then(response => {
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
            } else {
                const error = new Error();
                error.response = response;
                dispatch(signupFailed(error));
                throw error;
            }
        })
        .catch(error => {
            alert("Signup Failed: " + error.response.status);
        });
    };
}

function buildUsersGETRequestURL (userName) {
    let rootURL = apiURL + "users";
    let queryString = userName ? "?userName=" + userName : "";

    return rootURL + queryString;
}

export function getUser (userName = null) {
    return dispatch => {
        dispatch(getUserAttempt());
        fetch(buildUsersGETRequestURL(userName), {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getUserFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(getUserSuccess(response));
        })
        .catch(error => {
            alert("Get user Failed: " + error.response.status);
        });
    };
}

function buildUsersPUTRequestBody (userData) {
    let body = {};
    if (userData.name) { body.name = userData.name; }
    if (userData.email) { body.email = userData.email; }
    if (userData.password) { body.password = userData.password; }
    if (userData.homeCurrency) { body.homeCurrency = userData.homeCurrency; }

    return body;
}

export function putUser (userData) {
    // Perferably userData would contain ONLY entries that have been modified.
    return dispatch => {
        // Check that userData contains a userName. Required for the GET request URL query.
        if (!userData.userName) { return (alert("UserName is required.")); }
        // User fields to change.
        if (userData.name === "") { return (alert("Please enter a Name!")); }
        if (userData.email === "") { return (alert("Please enter an Email!")); }
        if (userData.password === "") { return (alert("Please enter a Password!")); }
        if (userData.homeCurrency === "") { return (alert("Please select a Home Currency!")); }

        let body = buildUsersPUTRequestBody(userData);
        if (Object.keys(body).length === 0) {
            // Nothing to update.
            alert("Nothing to update!");
            return;
        }

        dispatch(putUserAttempt());
        fetch(apiURL + "users/" + userData.userName, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(putUserFailed(error));
                throw error;
            }
        })
        .then(response => {
            // TODO: maybe decide not to print the changed fields (might not want to print a password).
            alert("Update Success! Changed the following:\n" + JSON.stringify(body, null, 2).replace(/\{|\}/g, ""));
            dispatch(putUserSuccess(response));
        })
        .catch(error => {
            alert("Update Failed: " + error.response.status);
        });
    };
}

