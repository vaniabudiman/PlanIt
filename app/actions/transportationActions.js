import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_TRANSPORTATION_ATTEMPT: "GET_TRANSPORTATION_ATTEMPT",
    GET_TRANSPORTATION_SUCCESS: "GET_TRANSPORTATION_SUCCESS",
    GET_TRANSPORTATION_FAILED: "GET_TRANSPORTATION_FAILED",
    GET_TRANSPORTATION_DETAILS_ATTEMPT: "GET_TRANSPORTATION_DETAILS_ATTEMPT",
    GET_TRANSPORTATION_DETAILS_SUCCESS: "GET_TRANSPORTATION_DETAILS_SUCCESS",
    GET_TRANSPORTATION_DETAILS_FAILED: "GET_TRANSPORTATION_DETAILS_FAILED",
    CREATE_TRANSPORTATION_ATTEMPT: "CREATE_TRANSPORTATION_ATTEMPT",
    CREATE_TRANSPORTATION_SUCCESS: "CREATE_TRANSPORTATION_SUCCESS",
    CREATE_TRANSPORTATION_FAILED: "CREATE_TRANSPORTATION_FAILED",
    DELETE_TRANSPORTATION_ATTEMPT: "DELETE_TRANSPORTATION_ATTEMPT",
    DELETE_TRANSPORTATION_SUCCESS: "DELETE_TRANSPORTATION_SUCCESS",
    DELETE_TRANSPORTATION_FAILED: "DELETE_TRANSPORTATION_FAILED",
    UPDATE_TRANSPORTATION_ATTEMPT: "UPDATE_TRANSPORTATION_ATTEMPT",
    UPDATE_TRANSPORTATION_SUCCESS: "UPDATE_TRANSPORTATION_SUCCESS",
    UPDATE_TRANSPORTATION_FAILED: "UPDATE_TRANSPORTATION_FAILED"
};

export function getTransportationAttempt () {
    return {
        type: Types.GET_TRANSPORTATION_ATTEMPT
    };
}

export function getTransportationSuccess (response) {
    return {
        transportations: response.transportations,
        type: Types.GET_TRANSPORTATION_SUCCESS
    };
}

export function getTransportationFailed (error) {
    return {
        error,
        type: Types.GET_TRANSPORTATION_FAILED
    };
}

export function getTransportationDetailsAttempt () {
    return {
        type: Types.GET_TRANSPORTATION_DETAILS_ATTEMPT
    };
}

export function getTransportationDetailsSuccess (response) {
    return {
        transportation: response.transportation,
        type: Types.GET_TRANSPORTATION_DETAILS_SUCCESS
    };
}

export function getTransportationDetailsFailed (error) {
    return {
        error,
        type: Types.GET_TRANSPORTATION_DETAILS_FAILED
    };
}

export function createTransportationAttempt () {
    return {
        type: Types.CREATE_TRANSPORTATION_ATTEMPT
    };
}

export function createTransportationSuccess (response) {
    return {
        transportation: response.transportation,
        type: Types.CREATE_TRANSPORTATION_SUCCESS
    };
}

export function createTransportationFailed (error) {
    return {
        error,
        type: Types.CREATE_TRANSPORTATION_FAILED
    };
}

export function updateTransportationAttempt () {
    return {
        type: Types.UPDATE_TRANSPORTATION_ATTEMPT
    };
}

export function updateTransportationSuccess (response) {
    return {
        transportation: response.transportation,
        type: Types.UPDATE_TRANSPORTATION_SUCCESS
    };
}

export function updateTransportationFailed (error) {
    return {
        error,
        type: Types.UPDATE_TRANSPORTATION_FAILED
    };
}

export function buildGETRequestURL (tripID, transportationID) {
    let rootURL = apiURL + "transportation";
    let queryString = tripID || transportationID ? "?" : "";
    queryString += tripID ? "tripID=" + tripID : "";
    queryString += tripID && transportationID ? "," : "";
    queryString += transportationID ? "transportationID=" + transportationID : "";

    return rootURL + queryString;
}

export function buildPOSTRequestURL () {
    return apiURL + "transportation";
}

export function buildPUTRequestURL (transportationID) {
    return apiURL + "transportation/" + transportationID;
}

export function buildDELETERequestURL (transportationID) {
    return apiURL + "transportation/" + transportationID;
}

export function deleteTransportationAttempt () {
    return {
        type: Types.DELETE_TRANSPORTATION_ATTEMPT
    };
}

export function deleteTransportationSuccess (transportationId) {
    return {
        transportationId: transportationId,
        type: Types.DELETE_TRANSPORTATION_SUCCESS
    };
}

export function deleteTransportationFailed (error) {
    return {
        error,
        type: Types.DELETE_TRANSPORTATION_FAILED
    };
}


export function getTransportationDetails (transportationId) {
    return dispatch => {
        dispatch(getTransportationDetailsAttempt());

        fetch(buildGETRequestURL(null, transportationId), {
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
                let notFoundResponse = { transportation: {} };
                return notFoundResponse;
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getTransportationDetailsFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(getTransportationDetailsSuccess(response));
        })
        .catch(error => {
            alert("Request Failed: ", error); // TODO: remove this and do something with the fetch error
        });};
}

export function deleteTransportation (transportationId) {
    if (!transportationId) {
        return alert ("No transportation was selected to delete.");
    }

    return dispatch => {
        dispatch(deleteTransportationAttempt());

        fetch(buildDELETERequestURL(transportationId), {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(response => { // Header response.
            if (response.status >= 200 && response.status < 300) {
                dispatch(deleteTransportationSuccess(transportationId));
            } else {
                const error = new Error();
                error.response = response;
                dispatch(deleteTransportationFailed(error));
                throw error;
            }
        })
        .catch(error => {
            alert("Request Failed: ", error); // TODO: remove this and do something with the fetch error
        });};
}

export function updateTransportation (transportationId, transportationData) {
    return dispatch => {
        if (transportationData.type === "") { return (alert("Please select a type!")); }
        if (transportationData.departureDateTime === "") { return (alert("Please enter a departure date and time!")); }
        if (transportationData.arrivalDateTime === "") { return (alert("Please enter an arrival date and time!")); }
        dispatch(updateTransportationAttempt());
        fetch(buildPUTRequestURL(transportationId), {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: transportationData.type,
                operator: transportationData.operator,
                number: transportationData.number,
                departureAddress: transportationData.departureAddress,
                departureDateTime: transportationData.departureDateTime,
                arrivalAddress: transportationData.arrivalAddress,
                arrivalDateTime: transportationData.arrivalDateTime
            }),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(updateTransportationFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(updateTransportationSuccess(response));
        })
        .catch(error => {
            alert("PUT Transportation Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });
    };
}

export function getTransportation (tripId) {
    return dispatch => {
        dispatch(getTransportationAttempt());

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
                let notFoundResponse = { transportations: [] };
                return notFoundResponse;
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getTransportationFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(getTransportationSuccess(response));
        })
        .catch(error => {
            alert("Request Failed: ", error); // TODO: remove this and do something with the fetch error
        });};
}

export function createTransportation (transportationData) {
    return dispatch => {
        if (transportationData.type === "") { return (alert("Please select a type!")); }
        if (transportationData.departureDateTime === "") { return (alert("Please enter a departure date and time!")); }
        if (transportationData.arrivalDateTime === "") { return (alert("Please enter an arrival date and time!")); }
        
        dispatch(createTransportationAttempt());

        let transportation = {
            type: transportationData.type,
            operator: transportationData.operator,
            number: transportationData.number,
            departureAddress: transportationData.departureAddress,
            departureDateTime: transportationData.departureDateTime,
            arrivalAddress: transportationData.arrivalAddress,
            arrivalDateTime: transportationData.arrivalDateTime
        };

        fetch(buildPOSTRequestURL(), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tripID: transportationData.tripID,
                transportation: [transportation]
            }),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(createTransportationFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(createTransportationSuccess(response));
        })
        .catch(error => {
            alert("POST Transportation Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });
    };
}

export default {
    getTransportationAttempt: getTransportationAttempt,
    getTransportationSuccess: getTransportationSuccess,
    getTransportationFailed: getTransportationFailed,

    getTransportationDetailsAttempt: getTransportationDetailsAttempt,
    getTransportationDetailsSuccess: getTransportationDetailsSuccess,
    getTransportationDetailsFailed: getTransportationDetailsFailed,

    createTransportationAttempt: createTransportationAttempt,
    createTransportationSuccess: createTransportationSuccess,
    createTransportationFailed: createTransportationFailed,

    updateTransportationAttempt: updateTransportationAttempt,
    updateTransportationSuccess: updateTransportationSuccess,
    updateTransportationFailed: updateTransportationFailed,

    deleteTransportationAttempt: deleteTransportationAttempt,
    deleteTransportationSuccess: deleteTransportationSuccess,
    deleteTransportationFailed: deleteTransportationFailed,

    getTransportationDetails: getTransportationDetails,
    deleteTransportation: deleteTransportation,
    updateTransportation: updateTransportation,
    getTransportation: getTransportation,
    createTransportation: createTransportation
};