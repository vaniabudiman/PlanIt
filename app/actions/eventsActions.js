import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_EVENTS_ATTEMPT: "GET_EVENTS_ATTEMPT",
    GET_EVENTS_SUCCESS: "GET_EVENTS_SUCCESS",
    GET_EVENTS_FAILED: "GET_EVENTS_FAILED",
    GET_EVENT_DETAILS_ATTEMPT: "GET_EVENT_DETAILS_ATTEMPT",
    GET_EVENT_DETAILS_SUCCESS: "GET_EVENT_DETAILS_SUCCESS",
    GET_EVENT_DETAILS_FAILED: "GET_EVENT_DETAILS_FAILED",
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

export function getEventsAttempt () {
    return {
        type: Types.GET_EVENTS_ATTEMPT
    };
}

export function getEventsSuccess (response) {
    return {
        events: response.events,
        type: Types.GET_EVENTS_SUCCESS
    };
}

export function getEventsFailed (error) {
    return {
        error,
        type: Types.GET_EVENTS_FAILED
    };
}

export function getEventDetailsAttempt () {
    return {
        type: Types.GET_EVENT_DETAILS_ATTEMPT
    };
}

export function getEventDetailsSuccess (response) {
    return {
        event: response.event,
        type: Types.GET_EVENT_DETAILS_SUCCESS
    };
}

export function getEventDetailsFailed (error) {
    return {
        error,
        type: Types.GET_EVENT_DETAILS_FAILED
    };
}

export function createEventAttempt () {
    return {
        type: Types.CREATE_EVENT_ATTEMPT
    };
}

export function createEventSuccess (response) {
    return {
        event: response.event,
        type: Types.CREATE_EVENT_SUCCESS
    };
}

export function createEventFailed (error) {
    return {
        error,
        type: Types.CREATE_EVENT_FAILED
    };
}

export function updateEventAttempt () {
    return {
        type: Types.UPDATE_EVENT_ATTEMPT
    };
}

export function updateEventSuccess (response) {
    return {
        event: response.event,
        type: Types.UPDATE_EVENT_SUCCESS
    };
}

export function updateEventFailed (error) {
    return {
        error,
        type: Types.UPDATE_EVENT_FAILED
    };
}

export function buildGETRequestURL (tripID, eventID) {
    let rootURL = apiURL + "events";
    let queryString = tripID || eventID ? "?" : "";
    queryString += tripID ? "tripID=" + tripID : "";
    queryString += tripID && eventID ? "," : "";
    queryString += eventID ? "eventID=" + eventID : "";

    return rootURL + queryString;
}

export function buildPOSTRequestURL () {
    return apiURL + "events";
}

export function buildPUTRequestURL (eventID) {
    return apiURL + "events/" + eventID;
}

export function buildDELETERequestURL (eventId) {
    return apiURL + "events/" + eventId;
}

export function deleteEventAttempt () {
    return {
        type: Types.DELETE_EVENT_ATTEMPT
    };
}

export function deleteEventSuccess (eventId) {
    return {
        eventId: eventId,
        type: Types.DELETE_EVENT_SUCCESS
    };
}

export function deleteEventFailed (error) {
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

export function getEventDetails (eventId) {
    return dispatch => {
        dispatch(getEventDetailsAttempt());

        fetch(buildGETRequestURL(null, eventId), {
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
                let notFoundResponse = { event: {} };
                return notFoundResponse;
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getEventDetailsFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(getEventDetailsSuccess(response));
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

        fetch(buildDELETERequestURL(eventId), {
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

export default {
    getEventsAttempt: getEventsAttempt,
    getEventsSuccess: getEventsSuccess,
    getEventsFailed: getEventsFailed,

    getEventDetailsAttempt: getEventDetailsAttempt,
    getEventDetailsSuccess: getEventDetailsSuccess,
    getEventDetailsFailed: getEventDetailsFailed,

    createEventAttempt: createEventAttempt,
    createEventSuccess: createEventSuccess,
    createEventFailed: createEventFailed,

    updateEventAttempt: updateEventAttempt,
    updateEventSuccess: updateEventSuccess,
    updateEventFailed: updateEventFailed,

    deleteEventAttempt: deleteEventAttempt,
    deleteEventSuccess: deleteEventSuccess,
    deleteEventFailed: deleteEventFailed,

    getEvents: getEvents,
    getEventDetails: getEventDetails,
    deleteEvent: deleteEvent,
    createEvent: createEvent,
    updateEvent: updateEvent
};