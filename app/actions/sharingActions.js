import { apiURL } from "../config/ServerConfig.js";
import _ from "underscore";

export const Types = {
    GET_SHARED_ATTEMPT: "GET_SHARED_ATTEMPT",
    GET_SHARED_SUCCESS: "GET_SHARED_SUCCESS",
    GET_SHARED_FAILED: "GET_SHARED_FAILED",
    CREATE_SHARED_ATTEMPT: "CREATE_SHARED_ATTEMPT",
    CREATE_SHARED_SUCCESS: "CREATE_SHARED_SUCCESS",
    CREATE_SHARED_FAILED: "CREATE_SHARED_FAILED",
    DELETE_SHARED_ATTEMPT: "DELETE_SHARED_ATTEMPT",
    DELETE_SHARED_SUCCESS: "DELETE_SHARED_SUCCESS",
    DELETE_SHARED_FAILED: "DELETE_SHARED_FAILED",
    UPDATE_SHARED_ATTEMPT: "UPDATE_SHARED_ATTEMPT",
    UPDATE_SHARED_SUCCESS: "UPDATE_SHARED_SUCCESS",
    UPDATE_SHARED_FAILED: "UPDATE_SHARED_FAILED"
};

export function getSharedAttempt () {
    return {
        type: Types.GET_SHARED_ATTEMPT
    };
}

export function getSharedSuccess (response) {
    return {
        events: response.events,
        bookmarks: response.bookmarks,
        type: Types.GET_SHARED_SUCCESS
    };
}

export function getSharedFailed (error) {
    return {
        error,
        type: Types.GET_SHARED_FAILED
    };
}

export function createSharedAttempt () {
    return {
        type: Types.CREATE_SHARED_ATTEMPT
    };
}

export function createSharedSuccess () {
    return {
        type: Types.CREATE_SHARED_SUCCESS
    };
}

export function createSharedFailed (error) {
    return {
        error,
        type: Types.CREATE_SHARED_FAILED
    };
}

export function deleteSharedAttempt () {
    return {
        type: Types.DELETE_SHARED_ATTEMPT
    };
}

export function deleteSharedSuccess () {
    return {
        type: Types.DELETE_SHARED_SUCCESS
    };
}

export function deleteSharedFailed (error) {
    return {
        error,
        type: Types.DELETE_SHARED_FAILED
    };
}

export function updateSharedAttempt () {
    return {
        type: Types.UPDATE_SHARED_ATTEMPT
    };
}

export function updateSharedSuccess () {
    return {
        type: Types.UPDATE_SHARED_SUCCESS
    };
}

export function updateSharedFailed (error) {
    return {
        error,
        type: Types.UPDATE_SHARED_FAILED
    };
}

export function buildGETRequestURL (isPending) {
    let rootURL = apiURL + "share";
    let query = isPending ? "?pending=true" : "";

    return rootURL + query;
}

export function buildPOSTRequestURL () {
    return apiURL + "share";
}

export function buildPUTRequestURL (permissionId) {
    return apiURL + "share/" + permissionId;
}

export function buildDELETERequestURL (permissionId) {
    return apiURL + "share/" + permissionId;
}

export function getShared (isPending = false) {
    return dispatch => {
        dispatch(getSharedAttempt());
        fetch(buildGETRequestURL(isPending), {
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
                if (response.status === 404) {
                    dispatch(getSharedSuccess({ events: [], bookmarks: [] }));
                } else {
                    const error = new Error();
                    error.response = response;
                    dispatch(getSharedFailed(error));
                    throw error;
                }
            }
        })
        .then(response => {
            dispatch(getSharedSuccess(response));
        })
        .catch(error => {
            alert("GET /share Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });};
}

export function createShared (tripId, writeFlag = false, id, type, users) {
    let body = {
        tripID: tripId,
        writeFlag: writeFlag,
        userName: users
    };

    switch (type) {
        case "BOOKMARK":
            body = _.extend(body, { bookmarkID: id });
            break;
        case "EVENT":
            body = _.extend(body, { eventID: id });
            break;
    }

    return dispatch => {
        dispatch(createSharedAttempt());
        fetch(buildPOSTRequestURL(), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return dispatch(createSharedSuccess(response));
            } else {
                const error = new Error();
                error.response = response;
                dispatch(createSharedFailed(error));
                throw error;
            }
        })
        .catch(error => {
            alert("POST Shared Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });
    };
}

export function updateShared (id, type, toTripId) {
    return dispatch => {
        if (toTripId === "") { return (alert("Please enter a trip to add this to!")); }
        dispatch(updateSharedAttempt());
        fetch(buildPUTRequestURL(id, toTripId), {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                toTrip: toTripId,
                type: type.toLowerCase()
            }),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return dispatch(updateSharedSuccess(response));
            } else {
                const error = new Error();
                error.response = response;
                dispatch(updateSharedFailed(error));
                throw error;
            }
        })
        .catch(error => {
            throw (error); // TODO: remove this and do something with the fetch error
        });
    };
}

export function deleteShared (permission) {
    return dispatch => {
        dispatch(deleteSharedAttempt());

        fetch(buildDELETERequestURL(permission.id), {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: permission.type.toLowerCase()
            }),
        })
        .then(response => { // Header response.
            if (response.status >= 200 && response.status < 300) {
                dispatch(deleteSharedSuccess());
            } else {
                const error = new Error();
                error.response = response;
                dispatch(deleteSharedFailed(error));
                throw error;
            }
        })
        .catch(error => {
            alert("Request Failed: ", error); // TODO: remove this and do something with the fetch error
        });};
}

export default {
    getSharedAttempt: getSharedAttempt,
    getSharedSuccess: getSharedSuccess,
    getSharedFailed: getSharedFailed,

    createSharedAttempt: createSharedAttempt,
    createSharedSuccess: createSharedSuccess,
    createSharedFailed: createSharedFailed,

    deleteSharedAttempt: deleteSharedAttempt,
    deleteSharedSuccess: deleteSharedSuccess,
    deleteSharedFailed: deleteSharedFailed,

    updateSharedAttempt: updateSharedAttempt,
    updateSharedSuccess: updateSharedSuccess,
    updateSharedFailed: updateSharedFailed,

    getShared: getShared,
    createShared: createShared,
    updateShared: updateShared,
    deleteShared: deleteShared
};