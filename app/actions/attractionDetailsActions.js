export const Types = {
    GET_ATTRACTION_DETAILS_ATTEMPT: "GET_ATTRACTION_DETAILS_ATTEMPT",
    GET_ATTRACTION_DETAILS_SUCCESS: "GET_ATTRACTION_DETAILS_SUCCESS",
    GET_ATTRACTION_DETAILS_FAILED: "GET_ATTRACTION_DETAILS_FAILED"
};

function getAttractionDetailsAttempt () {
    return {
        type: Types.GET_ATTRACTION_DETAILS_ATTEMPT
    };
}

function getAttractionDetailsSuccess (response) {
    return {
        details: response.result,
        type: Types.GET_ATTRACTION_DETAILS_SUCCESS
    };
}

function getAttractionDetailsFailed (error) {
    return {
        error,
        type: Types.GET_ATTRACTION_DETAILS_FAILED,
    };
}

function buildRequestURL (placeId) {
    let rootURL = "https://maps.googleapis.com/maps/api/place/details/json";
    // let apiKey = "AIzaSyBpbTBGgKbBpdWyPyQ8S8cFvBNc8-6KiOw";
    let apiKey = "AIzaSyBj1cQ0SRz1mFFwN4eCsqKAGNBCH4SSLbI";

    return rootURL +
        "?placeid=" + placeId +
        "&key=" + apiKey;
}

export function getAttractionDetails (placeId) {
    return dispatch => {
        dispatch(getAttractionDetailsAttempt());
        fetch(buildRequestURL(placeId), {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            }
        })
        .then(response => { // Header response.
            // console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getAttractionDetailsFailed(error));
                throw error;
            }
        })
        .then(response => { // json response
            dispatch(getAttractionDetailsSuccess(response));
            if (response.status === "OVER_QUERY_LIMIT") {
                alert(response.error_message);
            }
        })
        .catch(error => {
            // console.log("Request Failed", error);
            throw (error);
            // alert("Login Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });
    };
}