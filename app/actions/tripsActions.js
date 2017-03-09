import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_TRIPS_ATTEMPT: "GET_TRIPS_ATTEMPT",
    GET_TRIPS_SUCCESS: "GET_TRIPS_SUCCESS",
    GET_TRIPS_FAILED: "GET_TRIPS_FAILED",
    CREATE_TRIP_ATTEMPT: "CREATE_TRIP_ATTEMPT",
    CREATE_TRIP_SUCCESS: "CREATE_TRIP_SUCCESS",
    CREATE_TRIP_FAILED: "CREATE_TRIP_FAILED",
    UPDATE_TRIP_ATTEMPT: "UPDATE_TRIP_ATTEMPT",
    UPDATE_TRIP_SUCCESS: "UPDATE_TRIP_SUCCESS",
    UPDATE_TRIP_FAILED: "UPDATE_TRIP_FAILED"
};

function getTripsAttempt () {
    return {
        type: Types.GET_TRIPS_ATTEMPT
    };
}

function getTripsSuccess (response, tripID) {
    let resp = tripID ? [response.trip] : response.trips;
    return {
        trips: resp, // Array of trip objects. e.g. [{tripID: 1, ...},{tripID: 2, ...}]
        type: Types.GET_TRIPS_SUCCESS
    };
}

function getTripsFailed (error) {
    return {
        error,
        type: Types.GET_TRIPS_FAILED
    };
}

function createTripAttempt () {
    return {
        type: Types.CREATE_TRIP_ATTEMPT
    };
}

function createTripSuccess (response) {
    return {
        trip: response.trip,
        type: Types.CREATE_TRIP_SUCCESS
    };
}

function createTripFailed (error) {
    return {
        error,
        type: Types.CREATE_TRIP_FAILED
    };
}

function updateTripAttempt () {
    return {
        type: Types.UPDATE_TRIP_ATTEMPT
    };
}

function updateTripSuccess (response) {
    return {
        trip: response.trip,
        type: Types.UPDATE_TRIP_SUCCESS
    };
}

function updateTripFailed (error) {
    return {
        error,
        type: Types.UPDATE_TRIP_FAILED
    };
}

function buildGETRequestURL (tripID) {
    let rootURL = apiURL + "trips";
    let queryString = tripID ? "?tripID=" + tripID : "";

    return rootURL + queryString;
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
            } else {
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
        fetch(apiURL + "trips", {
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
        fetch(apiURL + "trips/" + tripId, {
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