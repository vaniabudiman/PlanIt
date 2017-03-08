export const Types = {
    GET_CITIES_ATTEMPT: "GET_CITIES_ATTEMPT",
    GET_CITIES_SUCCESS: "GET_CITIES_SUCCESS",
    GET_CITIES_FAILED: "GET_CITIES_FAILED"
};

function getCitiesAttempt () {
    return {
        type: Types.GET_CITIES_ATTEMPT
    };
}

function getCitiesSuccess (response) {
    return {
        cities: response.geonames,
        type: Types.GET_CITIES_SUCCESS,
    };
}

function getCitiesFailed (error) {
    return {
        error,
        type: Types.GET_CITIES_FAILED,
    };
}

function buildRequestURL (countryId) {
    let rootURL = "http://api.geonames.org/searchJSON";
    let apiKey = "&username=planitapp";

    return rootURL +
        "?country=" + countryId +
        "&featureCode=PPL" +
        "&orderby=relevance" +
        apiKey;
}

export function getCities (countryId) {
    return dispatch => {
        dispatch(getCitiesAttempt(countryId));
        fetch(buildRequestURL(countryId), {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(response => { // Header response.
            // console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getCitiesFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(getCitiesSuccess(response));
        })
        .catch(error => {
            // console.log("Request Failed", error);
            alert("Login Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });};
}