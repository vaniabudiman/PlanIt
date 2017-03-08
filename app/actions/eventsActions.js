import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_EVENTS_ATTEMPT: "GET_EVENTS_ATTEMPT",
    GET_EVENTS_SUCCESS: "GET_EVENTS_SUCCESS",
    GET_EVENTS_FAILED: "GET_EVENTS_FAILED"
};

function getEventsAttempt () {
    return {
        type: Types.GET_EVENTS_ATTEMPT
    };
}

function getEventsSuccess (response) {
    return {
        events: response,
        type: Types.GET_EVENTS_SUCCESS
    };
}

function getEventsFailed (error) {
    return {
        error,
        type: Types.GET_EVENTS_FAILED
    };
}

export function getEvents (tripId) {
    return dispatch => {
        dispatch(getEventsAttempt());

        fetch(apiURL + "events/" + tripId, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(response => { // Header response.
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getEventsFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(getEventsSuccess(response));
        })
        .catch(error => {
             alert("Request Failed: ", error); // TODO: remove this and do something with the fetch error
        });};
}