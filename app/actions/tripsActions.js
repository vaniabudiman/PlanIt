import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_TRIPS_ATTEMPT: "GET_TRIPS_ATTEMPT",
    GET_TRIPS_SUCCESS: "GET_TRIPS_SUCCESS",
    GET_TRIPS_FAILED: "GET_TRIPS_FAILED"
};

function getTripsAttempt () {
    return {
        type: Types.GET_TRIPS_ATTEMPT
    };
}

function getTripsSuccess (response, tripID) {
    let resp = tripID ? response.trip : response.trips;
    return {
        trips: resp,
        type: Types.GET_TRIPS_SUCCESS
    };
}

function getTripsFailed (error) {
    return {
        error,
        type: Types.GET_TRIPS_FAILED
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