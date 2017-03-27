import "react-native";
import Reducer from "../../app/reducers/attractionDetailsReducer.js";
import Actions, { buildRequestURL } from "../../app/actions/attractionDetailsActions.js";
import FETCH_STATUS from "../../app/constants/fetchStatusConstants.js";

describe("Attraction Details Reducer", function () {
    let details = {
        id: 123,
        test: "test"
    };

    function getInitialState () {
        return Reducer(undefined, {});
    }

    describe("buildRequestURL", function () {
        it ("builds correct URL", function () {
            let placeId = 123;
            expect(buildRequestURL(placeId)).toBe(
                "https://maps.googleapis.com/maps/api/place/details/json" +
                "?placeid=" + placeId +
                "&key=" +
                "AIzaSyC3QhzP3_zHPhxF2-u-GmKtlEc567mrjDo" // this apiKey changes when rotated
            );
        });
    });

    it("has correct initial state", function () {
        let initial = getInitialState();

        expect(initial.details).toBe(null);
        expect(initial.attractionDetailsGETStatus).toBe("");
        expect(initial.nextPageToken).toBe("");
    });

    it("sets attractionDetails GET attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getAttractionDetailsAttempt());
        expect(next.attractionDetailsGETStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets attractionDetails GET success status & details for the attraction", function () {
        let next = Reducer(getInitialState(), Actions.getAttractionDetailsSuccess({ result: details }));
        expect(next.attractionDetailsGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.details).toBe(details);
    });

    it("sets attractionDetails GET failed status", function () {
        let next = Reducer(getInitialState(), Actions.getAttractionDetailsFailed());
        expect(next.attractionDetailsGETStatus).toBe(FETCH_STATUS.FAILED);
    });
});