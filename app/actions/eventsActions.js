import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_EVENTS_ATTEMPT: "GET_EVENTS_ATTEMPT",
    GET_EVENTS_SUCCESS: "GET_EVENTS_SUCCESS",
    GET_EVENTS_FAILED: "GET_EVENTS_FAILED",

    DELETE_EVENT_ATTEMPT: "DELETE_EVENT_ATTEMPT",
    DELETE_EVENT_SUCCESS: "DELETE_EVENT_SUCCESS",
    DELETE_EVENT_FAILED: "DELETE_EVENT_FAILED"
};

function getEventsAttempt () {
    return {
        type: Types.GET_EVENTS_ATTEMPT
    };
}

function getEventsSuccess (response) {
    return {
        events: response.events,
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

        fetch(apiURL + "events?tripID=" + tripId, {
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

function deleteEventSuccess (eventId) {
    return {
        eventId: eventId,
        type: Types.DELETE_EVENT_SUCCESS
    };
}

function deleteEventFailed (error) {
    return {
        error,
        type: Types.DELETE_EVENT_FAILED
    };
}

export function deleteEvent (eventId) {
    if (!eventId) {
        return alert ("No event was selected to delete.");
    }

    return dispatch => {
        dispatch(deleteEventAttempt());

        fetch(apiURL + "events/" + eventId, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(response => { // Header response.
            if (response.status >= 200 && response.status < 300) {
                dispatch(deleteEventSuccess(eventId));
            } else {
                const error = new Error();
                error.response = response;
                dispatch(deleteEventFailed(error));
                throw error;
            }
        })
        .catch(error => {
            alert("Request Failed: ", error); // TODO: remove this and do something with the fetch error
        });};
}
