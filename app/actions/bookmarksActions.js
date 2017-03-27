import { apiURL } from "../config/ServerConfig.js";

export const Types = {
    GET_BOOKMARKS_ATTEMPT: "GET_BOOKMARKS_ATTEMPT",
    GET_BOOKMARKS_SUCCESS: "GET_BOOKMARKS_SUCCESS",
    GET_BOOKMARKS_FAILED: "GET_BOOKMARKS_FAILED",

    DELETE_BOOKMARKS_ATTEMPT: "DELETE_BOOKMARKS_ATTEMPT",
    DELETE_BOOKMARKS_SUCCESS: "DELETE_BOOKMARKS_SUCCESS",
    DELETE_BOOKMARKS_FAILED: "DELETE_BOOKMARKS_FAILED"
};

export function deleteBookmarkAttempt () {
    return {
        type: Types.DELETE_BOOKMARKS_ATTEMPT
    };
}

export function deleteBookmarkSuccess (bookmarkId) {
    return {
        bookmarkId: bookmarkId,
        type: Types.DELETE_BOOKMARKS_SUCCESS
    };
}

export function deleteBookmarkFailed (error) {
    return {
        error,
        type: Types.DELETE_BOOKMARKS_FAILED
    };
}

export function buildBookmarksDELETERequestURL (bookmarkId) {
    return apiURL + "bookmarks/" + bookmarkId;
}

export function deleteBookmark (bookmarkId) {
    if (!bookmarkId) {
        return alert ("No bookmark was selected to delete.");
    }

    return dispatch => {
        dispatch(deleteBookmarkAttempt());

        fetch(buildBookmarksDELETERequestURL(bookmarkId), {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(response => { // Header response.
            if (response.status >= 200 && response.status < 300) {
                dispatch(deleteBookmarkSuccess(bookmarkId));
            } else {
                const error = new Error();
                error.response = response;
                dispatch(deleteBookmarkFailed(error));
                throw error;
            }
        })
        .catch(error => {
            alert("Request Failed: ", error); // TODO: remove this and do something with the fetch error
        });};
}

export function getBookmarksAttempt () {
    return {
        type: Types.GET_BOOKMARKS_ATTEMPT
    };
}

export function getBookmarksSuccess (response) {
    return {
        bookmarks: response.bookmarks,
        type: Types.GET_BOOKMARKS_SUCCESS
    };
}

export function getBookmarksFailed (error) {
    return {
        error,
        type: Types.GET_BOOKMARKS_FAILED
    };
}

export function buildBookmarksGETRequestURL (tripId) {
    return apiURL + "bookmarks?tripID=" + tripId;
}

export function getBookmarks (tripId) {
    return dispatch => {
        dispatch(getBookmarksAttempt());

        fetch(buildBookmarksGETRequestURL(tripId), {
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
                let notFoundResponse = { bookmarks: [] };
                return notFoundResponse;
            } else {
                const error = new Error();
                error.response = response;
                dispatch(getBookmarksFailed(error));
                throw error;
            }
        })
        .then(response => {
            dispatch(getBookmarksSuccess(response));
        })
        .catch(error => {
            alert("Request Failed: ", error); // TODO: remove this and do something with the fetch error
        });};
}

export default {
    deleteBookmarkAttempt: deleteBookmarkAttempt,
    deleteBookmarkSuccess: deleteBookmarkSuccess,
    deleteBookmarkFailed: deleteBookmarkFailed,

    getBookmarksAttempt: getBookmarksAttempt,
    getBookmarksSuccess: getBookmarksSuccess,
    getBookmarksFailed: getBookmarksFailed,

    deleteBookmark: deleteBookmark,
    getBookmarks: getBookmarks
};