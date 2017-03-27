import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_ATTRACTIONS_ATTEMPT: "GET_ATTRACTIONS_ATTEMPT",
    GET_ATTRACTIONS_SUCCESS: "GET_ATTRACTIONS_SUCCESS",
    GET_ATTRACTIONS_FAILED: "GET_ATTRACTIONS_FAILED",
    CLEAR_ATTRACTIONS_PAGE_TOKEN: "CLEAR_ATTRACTIONS_PAGE_TOKEN",

    POST_ATTRACTIONS_ATTEMPT: "POST_ATTRACTIONS_ATTEMPT",
    POST_ATTRACTIONS_SUCCESS: "POST_ATTRACTIONS_SUCCESS",
    POST_ATTRACTIONS_FAILED: "POST_ATTRACTIONS_FAILED",
};

export function clearAttractionsPageToken () {
    return {
        type: Types.CLEAR_ATTRACTIONS_PAGE_TOKEN
    };
}

export function getAttractionsAttempt () {
    return {
        type: Types.GET_ATTRACTIONS_ATTEMPT
    };
}

export function getAttractionsSuccess (response) {
    return {
        attractions: response.results,
        nextPageToken: response.next_page_token,
        type: Types.GET_ATTRACTIONS_SUCCESS
    };
}

export function getAttractionsFailed (error) {
    return {
        error,
        type: Types.GET_ATTRACTIONS_FAILED,
    };
}

export function postAttractionsAttempt () { return { type: Types.POST_ATTRACTIONS_ATTEMPT }; }
export function postAttractionsSuccess () { return { type: Types.POST_ATTRACTIONS_SUCCESS }; }
export function postAttractionsFailed () { return { type: Types.POST_ATTRACTIONS_FAILED }; }

export function buildAttractionsGETRequestURL (lat, lon, pageToken, query) {
    let api = query ? "/textsearch" : "/nearbysearch";
    let rootURL = "https://maps.googleapis.com/maps/api/place" + api + "/json";
    // let apiKey = "AIzaSyBpbTBGgKbBpdWyPyQ8S8cFvBNc8-6KiOw";
    // let apiKey = "AIzaSyBj1cQ0SRz1mFFwN4eCsqKAGNBCH4SSLbI";
    let apiKey = "AIzaSyC3QhzP3_zHPhxF2-u-GmKtlEc567mrjDo";

    // TODO: potential addition... to make these specifiable by user
    let radius = "10000";
    let type = "point_of_interest";

    return rootURL +
        "?location=" + lat + "%2C" + lon +
        "&radius=" + radius +
        "&type=" + type +
        "&query=" + query +
        "&key=" + apiKey +
        "&pagetoken=" + pageToken;
}

export function buildAttractionsPOSTRequestURL () {
    return apiURL + "bookmarks";
}

export function postAttractions (attraction, tripID) {
    return dispatch => {
        dispatch(postAttractionsAttempt());
        let bookmark = {
            lat: attraction.lat,
            lon: attraction.lon,
            placeID: attraction.id,
            name: attraction.title,
            address: attraction.subtitle,
            type: attraction.caption || "",
        };
        fetch(buildAttractionsPOSTRequestURL(), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tripID: tripID,
                bookmarks: [bookmark],
            }),
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error();
                error.response = response;
                dispatch(postAttractionsFailed(error));
                throw error;
            }
        })
        .then(response => {
            alert("Attraction successfully added to Bookmarks.");
            dispatch(postAttractionsSuccess(response));
        })
        .catch(error => {
            alert("Failed to save Attraction." + error.response.status);
        });
    };
}

export function getAttractions (city, pageToken, query = "") {
    return dispatch => {
        dispatch(getAttractionsAttempt());
        fetch(buildAttractionsGETRequestURL(city.lat, city.lon, pageToken, query), {
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
                dispatch(getAttractionsFailed(error));
                throw error;
            }
        })
        .then(response => { // json response
            dispatch(getAttractionsSuccess(response));
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

export default {
    clearAttractionsPageToken: clearAttractionsPageToken,

    getAttractionsAttempt: getAttractionsAttempt,
    getAttractionsSuccess: getAttractionsSuccess,
    getAttractionsFailed: getAttractionsFailed,

    postAttractionsAttempt: postAttractionsAttempt,
    postAttractionsSuccess: postAttractionsSuccess,
    postAttractionsFailed: postAttractionsFailed
};