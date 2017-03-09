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

function getAttractionsAttempt () {
    return {
        type: Types.GET_ATTRACTIONS_ATTEMPT
    };
}

function getAttractionsSuccess (response) {
    return {
        attractions: response.results,
        nextPageToken: response.next_page_token,
        type: Types.GET_ATTRACTIONS_SUCCESS
    };
}

function getAttractionsFailed (error) {
    return {
        error,
        type: Types.GET_ATTRACTIONS_FAILED,
    };
}

function postAttractionsAttempt () { return { type: Types.POST_ATTRACTIONS_ATTEMPT }; }
function postAttractionsSuccess () { return { type: Types.POST_ATTRACTIONS_SUCCESS }; }
function postAttractionsFailed () { return { type: Types.POST_ATTRACTIONS_FAILED }; }

function buildRequestURL (lat, lon, pageToken, query) {
    let api = query ? "/textsearch" : "/nearbysearch";
    let rootURL = "https://maps.googleapis.com/maps/api/place" + api + "/json";
    let apiKey = "AIzaSyBpbTBGgKbBpdWyPyQ8S8cFvBNc8-6KiOw";

    // TODO: potential addition... to make these specifiable by user
    let radius = "50000";   // NOTE: this is the max of the api... high to compensate for slightly off geonames api cities lat/lon
    let type = "point_of_interest";

    return rootURL +
        "?location=" + lat + "%2C" + lon +
        "&radius=" + radius +
        "&type=" + type +
        "&query=" + query +
        "&key=" + apiKey +
        "&pagetoken=" + pageToken;
}

export function getAttractions (city, pageToken, query = "") {
    return dispatch => {
        dispatch(getAttractionsAttempt());
        fetch(buildRequestURL(city.lat, city.lon, pageToken, query), {
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
        })
        .catch(error => {
            // console.log("Request Failed", error);
            throw (error);
            // alert("Login Failed: " + error.response.status); // TODO: remove this and do something with the fetch error
        });
    };
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
        fetch(apiURL + "bookmarks", {
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
            alert("Attraction Bookmark successfully saved.");
            dispatch(postAttractionsSuccess(response));
        })
        .catch(error => {
            alert("Failed to save Attraction." + error.response.status);
        });
    };
}