import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_EVENTS_ATTEMPT: "GET_EVENTS_ATTEMPT",
    GET_EVENTS_SUCCESS: "GET_EVENTS_SUCCESS",
    GET_EVENTS_FAILED: "GET_EVENTS_FAILED",
    CREATE_EVENT_ATTEMPT: "CREATE_EVENT_ATTEMPT",
    CREATE_EVENT_SUCCESS: "CREATE_EVENT_SUCCESS",
    CREATE_EVENT_FAILED: "CREATE_EVENT_FAILED",
    DELETE_EVENT_ATTEMPT: "DELETE_EVENT_ATTEMPT",
    DELETE_EVENT_SUCCESS: "DELETE_EVENT_SUCCESS",
    DELETE_EVENT_FAILED: "DELETE_EVENT_FAILED",
    UPDATE_EVENT_ATTEMPT: "UPDATE_EVENT_ATTEMPT",
    UPDATE_EVENT_SUCCESS: "UPDATE_EVENT_SUCCESS",
    UPDATE_EVENT_FAILED: "UPDATE_EVENT_FAILED"
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

function createEventAttempt () {
    return {
        type: Types.CREATE_EVENT_ATTEMPT
    };
}

function createEventSuccess (response) {
    return {
        event: response.event,
        type: Types.CREATE_EVENT_SUCCESS
    };
}

function createEventFailed (error) {
    return {
        error,
        type: Types.CREATE_EVENT_FAILED
    };
}

function updateEventAttempt () {
    return {
        type: Types.UPDATE_EVENT_ATTEMPT
    };
}

function updateEventSuccess (response) {
    return {
        event: response.event,
        type: Types.UPDATE_EVENT_SUCCESS
    };
}

function updateEventFailed (error) {
    return {
        error,
        type: Types.UPDATE_EVENT_FAILED
    };
}

function buildGETRequestURL (tripID, eventID) {
    let rootURL = apiURL + "events";
    let queryString = tripID || eventID ? "?" : "";
    queryString += tripID ? "tripID=" + tripID : "";
    queryString += tripID && eventID ? "," : "";
    queryString += eventID ? "eventID=" + eventID : "";

    return rootURL + queryString;
}

function buildPOSTRequestURL () {
    return apiURL + "events";
}

function buildPUTRequestURL (eventID) {
    return apiURL + "events/" + eventID;
}

function deleteEventAttempt () {
    return {
        type: Types.DELETE_EVENT_ATTEMPT
    };
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

export function getEvents (tripId) {
    return dispatch => {
        dispatch(getEventsAttempt());

        fetch(buildGETRequestURL(tripId, null), {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(response => { // Header response.
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else if (response.status === 404) {
                let notFoundResponse = { events: [] };
                return notFoundResponse;
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

export function createEvent (eventData) {
    return dispatch => {
        if (eventData.eventName === "") { return (alert("Please enter an event name!")); }
        if (eventData.startDateTime === "") { return (alert("Please enter a start date and time!")); }
        if (eventData.endDateTime === "") { return (alert("Please enter an end date and time!")); }
        
        dispatch(createEventAttempt());

        let event = {
            eventName: eventData.eventName,
            startDateTime: eventData.startDateTime,
            endDateTime: eventData.endDateTime,
            reminderFlag: eventData.reminderFlag,
            address: eventData.address,
            lat: eventData.lat,
            lon: eventData.lon,
            note: eventData.note
        };

        fetch(buildPOSTRequestURL(), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tripID: eventData.tripID,
                events: [event]
            }),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(createEventFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(createEventSuccess(response));
        })
        .catch(error => {
            alert("POST Events Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });
    };
}

export function updateEvent (eventId, eventData) {
    return dispatch => {
        if (eventData.eventName === "") { return (alert("Please enter an event name!")); }
        if (eventData.startDateTime === "") { return (alert("Please enter a start date and time!")); }
        if (eventData.endDateTime === "") { return (alert("Please enter an end date and time!")); }
        dispatch(updateEventAttempt());
        fetch(buildPUTRequestURL(eventId), {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventName: eventData.eventName,
                startDateTime: eventData.startDateTime,
                endDateTime: eventData.endDateTime,
                reminderFlag: eventData.reminderFlag,
                address: eventData.address,
                lat: eventData.lat,
                lon: eventData.lon,
                note: eventData.note
            }),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(updateEventFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(updateEventSuccess(response));
        })
        .catch(error => {
            alert("PUT Events Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });
    };
}
