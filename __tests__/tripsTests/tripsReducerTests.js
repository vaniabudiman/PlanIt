import "react-native";
import Reducer from "../../app/reducers/tripsReducer.js";
import Actions, {
    buildGETRequestURL,
    buildPOSTRequestURL,
    buildPUTRequestURL,
    buildDELETERequestURL
} from "../../app/actions/tripsActions.js";
import FETCH_STATUS from "../../app/constants/fetchStatusConstants.js";
import { apiURL } from "../../app/config/ServerConfig.js";


describe("trip Reducer", function () {
    let trips = [ { tripId: 0 }, { tripId: 1 } ];
    let trip = { tripId: 0 };
    let tripId = 123;

    function getInitialState () {
        return Reducer(undefined, {});
    }

    describe("buildGETRequestURL", function () {
        it("builds correct URL with tripId", function () {
            expect(buildGETRequestURL(tripId)).toBe(
                apiURL + "trips" +
                "?tripID=" + tripId
            );
        });

        it("builds correct URL without tripId", function () {
            expect(buildGETRequestURL()).toBe(
                apiURL + "trips"
            );
        });
    });

    describe("buildPOSTRequestURL", function () {
        it("builds correct URL", function () {
            expect(buildPOSTRequestURL()).toBe(apiURL + "trips");
        });
    });

    it("buildPUTRequestURL", function () {
        it("builds correct URL", function () {
            expect(buildPUTRequestURL(tripId)).toBe(apiURL + "trips/" + tripId);
        });
    });

    describe("buildDELETERequestURL", function () {
        it("builds correct URL", function () {
            expect(buildDELETERequestURL(tripId)).toBe(apiURL + "trips/" + tripId);
        });
    });

    it("has correct initial state", function () {
        let initial = getInitialState();

        expect(initial.trips).toEqual([]);
        expect(initial.trip).toEqual({});
        expect(initial.tripsGETStatus).toBe("");
        expect(initial.tripDELETEStatus).toBe("");
        expect(initial.tripPOSTStatus).toBe("");
        expect(initial.tripPUTStatus).toBe("");
        expect(initial.refresh).toBe(false);
    });

    it("sets trips GET attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getTripsAttempt());
        expect(next.tripsGETStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets trips GET success status & list of trips", function () {
        let next = Reducer(getInitialState(), Actions.getTripsSuccess({
            trips: trips
        }));
        expect(next.tripsGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.trips).toBe(trips);
        expect(next.refresh).toBe(false);
    });

    it("sets trips GET failed status", function () {
        let next = Reducer(getInitialState(), Actions.getTripsFailed());
        expect(next.tripsGETStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets trip POST attempt status", function () {
        let next = Reducer(getInitialState(), Actions.createTripAttempt());
        expect(next.tripPOSTStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets trip POST success status & trip", function () {
        let next = Reducer(getInitialState(), Actions.createTripSuccess({
            trip: trip
        }));
        expect(next.tripPOSTStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.trip).toBe(trip);
        expect(next.refresh).toBe(true);
    });

    it("sets trip POST failed status", function () {
        let next = Reducer(getInitialState(), Actions.createTripFailed());
        expect(next.tripPOSTStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets trip PUT attempt status", function () {
        let next = Reducer(getInitialState(), Actions.updateTripAttempt());
        expect(next.tripPUTStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets trip PUT success status & trip", function () {
        let next = Reducer(getInitialState(), Actions.updateTripSuccess({
            trip: trip
        }));
        expect(next.tripPUTStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.trip).toBe(trip);
        expect(next.refresh).toBe(true);
    });

    it("sets trip PUT failed status", function () {
        let next = Reducer(getInitialState(), Actions.updateTripFailed());
        expect(next.tripPUTStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets trip DELETE attempt status", function () {
        let next = Reducer(getInitialState(), Actions.deleteTripAttempt());
        expect(next.tripDELETEStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets trip DELETE success status & trip", function () {
        let next = Reducer(getInitialState(), Actions.deleteTripSuccess());
        expect(next.tripDELETEStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.refresh).toBe(true);
    });

    it("sets trip DELETE failed status", function () {
        let next = Reducer(getInitialState(), Actions.deleteTripFailed());
        expect(next.tripDELETEStatus).toBe(FETCH_STATUS.FAILED);
    });
});