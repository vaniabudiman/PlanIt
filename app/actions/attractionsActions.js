export const Types = {
    GET_ATTRACTIONS_ATTEMPT: "GET_ATTRACTIONS_ATTEMPT",
    GET_ATTRACTIONS_SUCCESS: "GET_ATTRACTIONS_SUCCESS",
    GET_ATTRACTIONS_FAILED: "GET_ATTRACTIONS_FAILED",
    CLEAR_ATTRACTIONS_PAGE_TOKEN: "CLEAR_ATTRACTIONS_PAGE_TOKEN"
};

export function clearAttractionsPageToken () {
    return {
        type: Types.CLEAR_ATTRACTIONS_PAGE_TOKEN
    };
}

function getAttractionsAttempt () {
    return {
        type: Types.GET_ATTRACTIONS_ATTEMPT,
    };
}

function getAttractionsSuccess (response) {
    return {
        items: response.results,
        pageToken: response.next_page_token,
        type: Types.GET_ATTRACTIONS_SUCCESS,
    };
}

function getAttractionsFailed (error) {
    return {
        error,
        type: Types.GET_ATTRACTIONS_FAILED,
    };
}

function buildRequestURL (lat, lon, pageToken, radius, type) {
    let rootURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    let apiKey = "AIzaSyBpbTBGgKbBpdWyPyQ8S8cFvBNc8-6KiOw";

    // TODO: remove... hardcoded for now to test
    lat = "43.70011";
    lon = "-79.4163";
    radius = "500";
    type = "point_of_interest";

    return rootURL +
        "?location=" + lat + "%2C" + lon +
        "&radius=" + radius +
        "&type=" + type +
        "&key=" + apiKey +
        "&pagetoken=" + pageToken;
}

export function getAttractions (countryCode, pageToken) {
    return dispatch => {
        dispatch(getAttractionsAttempt());
        fetch(buildRequestURL("", "", pageToken), {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
//            body: JSON.stringify({
//                userName: loginData.userName,
//                password: loginData.password,
//            }),
        })
        .then(response => { // Header response.
            // console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response.json();
//                  dispatch(getAttractionsSuccess(response));
//                dispatch(loginSuccess(response));
//                alert("Login Success. Hello " + loginData.userName + "!");
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getAttractionsFailed(error));
                throw error;
            }
//            return { header: response, response: response.json() };
        })
        .then(response => {
             // json response of newly created User object is here
            dispatch(getAttractionsSuccess(response));
        })
        .catch(error => {
            // console.log("Request Failed", error);
            alert("Login Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });};
}