import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_TRIPS_ATTEMPT: "GET_TRIPS_ATTEMPT",
    GET_TRIPS_SUCCESS: "GET_TRIPS_SUCCESS",
    GET_TRIPS_FAILED: "GET_TRIPS_FAILED",
    CREATE_TRIP_ATTEMPT: "CREATE_TRIP_ATTEMPT",
    CREATE_TRIP_SUCCESS: "CREATE_TRIP_SUCCESS",
    CREATE_TRIP_FAILED: "CREATE_TRIP_FAILED",
    DELETE_TRIP_ATTEMPT: "DELETE_TRIP_ATTEMPT",
    DELETE_TRIP_SUCCESS: "DELETE_TRIP_SUCCESS",
    DELETE_TRIP_FAILED: "DELETE_TRIP_FAILED",
    UPDATE_TRIP_ATTEMPT: "UPDATE_TRIP_ATTEMPT",
    UPDATE_TRIP_SUCCESS: "UPDATE_TRIP_SUCCESS",
    UPDATE_TRIP_FAILED: "UPDATE_TRIP_FAILED"
};

export function getTripsAttempt () {
    return {
        type: Types.GET_TRIPS_ATTEMPT
    };
}

export function getTripsSuccess (response, tripID) {
    let resp = tripID ? [response.trip] : response.trips;
    return {
        trips: resp, // Array of trip objects. e.g. [{tripID: 1, ...},{tripID: 2, ...}]
        type: Types.GET_TRIPS_SUCCESS
    };
}

export function getTripsFailed (error) {
    return {
        error,
        type: Types.GET_TRIPS_FAILED
    };
}

export function createTripAttempt () {
    return {
        type: Types.CREATE_TRIP_ATTEMPT
    };
}

export function createTripSuccess (response) {
    return {
        trip: response.trip,
        type: Types.CREATE_TRIP_SUCCESS
    };
}

export function createTripFailed (error) {
    return {
        error,
        type: Types.CREATE_TRIP_FAILED
    };
}

export function deleteTripAttempt () {
    return {
        type: Types.DELETE_TRIP_ATTEMPT
    };
}

export function deleteTripSuccess (tripId) {
    return {
        tripId: tripId,
        type: Types.DELETE_TRIP_SUCCESS
    };
}

export function deleteTripFailed (error) {
    return {
        error,
        type: Types.DELETE_TRIP_FAILED
    };
}

export function updateTripAttempt () {
    return {
        type: Types.UPDATE_TRIP_ATTEMPT
    };
}

export function updateTripSuccess (response) {
    return {
        trip: response.trip,
        type: Types.UPDATE_TRIP_SUCCESS
    };
}

export function updateTripFailed (error) {
    return {
        error,
        type: Types.UPDATE_TRIP_FAILED
    };
}

export function buildGETRequestURL (tripID) {
    let rootURL = apiURL + "trips";
    let queryString = tripID ? "?tripID=" + tripID : "";

    return rootURL + queryString;
}

export function buildPOSTRequestURL () {
    return apiURL + "trips";
}

export function buildPUTRequestURL (tripID) {
    return apiURL + "trips/" + tripID;
}

export function buildDELETERequestURL (tripId) {
    return apiURL + "trips/" + tripId;
}

export function getTrips (tripID = null) {
    return dispatch => {
        dispatch(getTripsAttempt());
        fetch(buildGETRequestURL(tripID), {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else if (response.status === 404) {
                let notFoundResponse = { trips: [] };
                return notFoundResponse;
            }else {
                const error = new Error();
                error.response = response;
                dispatch(getTripsFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(getTripsSuccess(response, tripID));
        })
        .catch(error => {
            alert("GET /trips Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });};
}

export function createTrip (tripData) {
    return dispatch => {
        if (tripData.tripName === "") { return (alert("Please enter a trip name!")); }
        if (tripData.startDate === "") { return (alert("Please enter a start date!")); }
        if (tripData.endDate === "") { return (alert("Please enter an end date!")); }
        dispatch(createTripAttempt());
        fetch(buildPOSTRequestURL(), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tripName: tripData.tripName,
                startDate: tripData.startDate,
                endDate: tripData.endDate,
                active: false
            }),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(createTripFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(createTripSuccess(response));
        })
        .catch(error => {
            alert("POST Trips Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });
    };
}

export function updateTrip (tripId, tripData) {
    return dispatch => {
        if (tripData.tripName === "") { return (alert("Please enter a trip name!")); }
        if (tripData.startDate === "") { return (alert("Please enter a start date!")); }
        if (tripData.endDate === "") { return (alert("Please enter an end date!")); }
        dispatch(updateTripAttempt());
        fetch(buildPUTRequestURL(tripId), {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tripName: tripData.tripName,
                startDate: tripData.startDate,
                endDate: tripData.endDate,
                active: false
            }),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(updateTripFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(updateTripSuccess(response));
        })
        .catch(error => {
            throw (error); // TODO: remove this and do something with the fetch error
        });
    };
}

export function deleteTrip (tripId) {
    if (!tripId) {
        return alert ("No trip was selected to delete.");
    }

    return dispatch => {
        dispatch(deleteTripAttempt());

        fetch(buildDELETERequestURL(tripId), {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(response => { // Header response.
            if (response.status >= 200 && response.status < 300) {
                dispatch(deleteTripSuccess(tripId));
            } else {
                const error = new Error();
                error.response = response;
                dispatch(deleteTripFailed(error));
                throw error;
            }
        })
        .catch(error => {
            alert("Request Failed: ", error); // TODO: remove this and do something with the fetch error
        });};
}

export default {
    getTripsAttempt: getTripsAttempt,
    getTripsSuccess: getTripsSuccess,
    getTripsFailed: getTripsFailed,

    createTripAttempt: createTripAttempt,
    createTripSuccess: createTripSuccess,
    createTripFailed: createTripFailed,

    deleteTripAttempt: deleteTripAttempt,
    deleteTripSuccess: deleteTripSuccess,
    deleteTripFailed: deleteTripFailed,

    updateTripAttempt: updateTripAttempt,
    updateTripSuccess: updateTripSuccess,
    updateTripFailed: updateTripFailed,

    getTrips: getTrips,
    createTrip: createTrip,
    updateTrip: updateTrip,
    deleteTrip: deleteTrip
};