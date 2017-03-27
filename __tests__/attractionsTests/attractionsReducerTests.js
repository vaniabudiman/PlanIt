import "react-native";
import Reducer from "../../app/reducers/attractionsReducer.js";
import Actions, {
    buildAttractionsGETRequestURL,
    buildAttractionsPOSTRequestURL
} from "../../app/actions/attractionsActions.js";
import FETCH_STATUS from "../../app/constants/fetchStatusConstants.js";
import { apiURL } from "../../app/config/ServerConfig.js";


describe("Attraction Reducer", function () {
    let attractions = [ { id: 0 }, { id: 1 } ];
    let pageToken = "123xyz";

    function getInitialState () {
        return Reducer(undefined, {});
    }

    describe("buildAttractionsGETRequestURL", function () {
        let lat = 10;
        let lon = 20;
        let query = "testing";

        it("builds correct URL with a query string", function () {
            expect(buildAttractionsGETRequestURL(lat, lon, pageToken, query)).toBe(
                "https://maps.googleapis.com/maps/api/place/textsearch/json" +
                "?location=" + lat + "%2C" + lon +
                "&radius=10000" +
                "&type=point_of_interest" +
                "&query=" + query +
                "&key=" + "AIzaSyC3QhzP3_zHPhxF2-u-GmKtlEc567mrjDo" + // this apiKey changes when rotated
                "&pagetoken=" + pageToken
            );
        });

        it("builds correct URL without a query string", function () {
            expect(buildAttractionsGETRequestURL(lat, lon, pageToken)).toBe(
                "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
                "?location=" + lat + "%2C" + lon +
                "&radius=10000" +
                "&type=point_of_interest" +
                "&query=" + undefined +
                "&key=" + "AIzaSyC3QhzP3_zHPhxF2-u-GmKtlEc567mrjDo" + // this apiKey changes when rotated
                "&pagetoken=" + pageToken
            );
        });
    });

    it("buildAttractionsPOSTRequestURL", function () {
        it("builds correct URL", function () {
            expect(buildAttractionsPOSTRequestURL()).toBe(apiURL + "bookmarks");
        });
    });

    it("has correct initial state", function () {
        let initial = getInitialState();

        expect(initial.attractions).toEqual([]);
        expect(initial.attractionsGETStatus).toBe("");
        expect(initial.attractionsPOSTStatus).toBe("");
        expect(initial.nextPageToken).toBe("");
    });

    it("clears page token", function () {
        let next = Reducer(getInitialState(), Actions.clearAttractionsPageToken());
        expect(next.nextPageToken).toBe("");
    });

    it("sets attractions GET attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getAttractionsAttempt());
        expect(next.attractionsGETStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets attractions GET success status & details for the attraction", function () {
        let next = Reducer(getInitialState(), Actions.getAttractionsSuccess({
            results: attractions,
            next_page_token: pageToken  // eslint-disable-line camelcase
        }));
        expect(next.attractionsGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.attractions).toBe(attractions);
        expect(next.nextPageToken).toBe(pageToken);
    });

    it("sets attractions GET failed status", function () {
        let next = Reducer(getInitialState(), Actions.getAttractionsFailed());
        expect(next.attractionsGETStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets attractions POST attempt status", function () {
        let next = Reducer(getInitialState(), Actions.postAttractionsAttempt());
        expect(next.attractionsPOSTStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets attractions POST success status", function () {
        let next = Reducer(getInitialState(), Actions.postAttractionsSuccess());
        expect(next.attractionsPOSTStatus).toBe(FETCH_STATUS.SUCCESS);
    });

    it("sets attractions POST failed status", function () {
        let next = Reducer(getInitialState(), Actions.postAttractionsFailed());
        expect(next.attractionsPOSTStatus).toBe(FETCH_STATUS.FAILED);
    });
});