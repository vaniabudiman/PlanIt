import "react-native";
import Reducer from "../../app/reducers/bookmarksReducer.js";
import Actions, {
    buildBookmarksDELETERequestURL,
    buildBookmarksGETRequestURL
} from "../../app/actions/bookmarksActions.js";
import FETCH_STATUS from "../../app/constants/fetchStatusConstants.js";
import { apiURL } from "../../app/config/ServerConfig.js";


describe("Bookmarks Reducer", function () {
    let bookmarks = [ { bookmarkID: 0 }, { bookmarkID: 1 } ];
    let bookmarkId = 123;
    let tripId = 456;

    function getInitialState () {
        return Reducer(undefined, {});
    }

    describe("buildBookmarksDELETERequestURL", function () {
        it("builds correct URL", function () {
            expect(buildBookmarksDELETERequestURL(bookmarkId)).toBe(apiURL + "bookmarks/" + bookmarkId);
        });
    });

    it("buildBookmarksGETRequestURL", function () {
        it("builds correct URL", function () {
            expect(buildBookmarksGETRequestURL()).toBe(apiURL + "bookmarks?tripID=" + tripId);
        });
    });

    it("has correct initial state", function () {
        let initial = getInitialState();

        expect(initial.bookmarks).toEqual([]);
        expect(initial.bookmarksGETStatus).toBe("");
        expect(initial.bookmarksDELETEStatus).toBe("");
    });

    it("sets bookmarks GET attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getBookmarksAttempt());
        expect(next.bookmarksGETStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets bookmarks GET success status & list of bookmarks", function () {
        let next = Reducer(getInitialState(), Actions.getBookmarksSuccess({
            bookmarks: bookmarks
        }));
        expect(next.bookmarksGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.bookmarks).toBe(bookmarks);
    });

    it("sets bookmarks GET failed status", function () {
        let next = Reducer(getInitialState(), Actions.getBookmarksFailed());
        expect(next.bookmarksGETStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets bookmarks DELETE attempt status", function () {
        let next = Reducer(getInitialState(), Actions.deleteBookmarkAttempt());
        expect(next.bookmarksDELETEStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets bookmarks DELETE success status", function () {
        // Set bookmarks list so it's not empty first
        let next = Reducer(getInitialState(), Actions.getBookmarksSuccess({
            bookmarks: bookmarks
        }));
        expect(next.bookmarksGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.bookmarks).toBe(bookmarks);

        // Delete a bookmark from that list
        next = Reducer(next, Actions.deleteBookmarkSuccess(0));
        expect(next.bookmarksDELETEStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.bookmarks.length).toBe(1);
        expect(next.bookmarks).toEqual([ { bookmarkID: 1 } ]);
    });

    it("sets bookmarks DELETE failed status", function () {
        let next = Reducer(getInitialState(), Actions.deleteBookmarkFailed());
        expect(next.bookmarksDELETEStatus).toBe(FETCH_STATUS.FAILED);
    });
});