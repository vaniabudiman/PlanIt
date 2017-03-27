import "react-native";
import Reducer from "../../app/reducers/transportationReducer.js";
import Actions, {
    buildGETRequestURL,
    buildPOSTRequestURL,
    buildPUTRequestURL,
    buildDELETERequestURL
} from "../../app/actions/transportationActions.js";
import FETCH_STATUS from "../../app/constants/fetchStatusConstants.js";
import { apiURL } from "../../app/config/ServerConfig.js";


describe("Transportation Reducer", function () {
    let transportations = [ { transportationId: 0 }, { transportationId: 1 } ];
    let transportation = { transportationId: 0 };
    let transportationId = 123;
    let tripId = 456;

    function getInitialState () {
        return Reducer(undefined, {});
    }

    describe("buildGETRequestURL", function () {
        it("builds correct URL with tripId", function () {
            expect(buildGETRequestURL(tripId)).toBe(
                apiURL + "transportation" +
                "?tripID=" + tripId
            );
        });

        it("builds correct URL with transportationId", function () {
            expect(buildGETRequestURL(null, transportationId)).toBe(
                apiURL + "transportation" +
                "?transportationID=" + transportationId
            );
        });

        it("builds correct URL with tripId & transportationId", function () {
            expect(buildGETRequestURL(tripId, transportationId)).toBe(
                apiURL + "transportation" +
                "?tripID=" + tripId +
                ",transportationID=" + transportationId
            );
        });
    });

    describe("buildPOSTRequestURL", function () {
        it("builds correct URL", function () {
            expect(buildPOSTRequestURL()).toBe(apiURL + "transportation");
        });
    });

    it("buildPUTRequestURL", function () {
        it("builds correct URL", function () {
            expect(buildPUTRequestURL(transportationId)).toBe(apiURL + "transportation/" + transportationId);
        });
    });

    describe("buildDELETERequestURL", function () {
        it("builds correct URL", function () {
            expect(buildDELETERequestURL(transportationId)).toBe(apiURL + "transportation/" + transportationId);
        });
    });

    it("has correct initial state", function () {
        let initial = getInitialState();

        expect(initial.transportations).toEqual([]);
        expect(initial.transportation).toEqual({});
        expect(initial.transportationGETStatus).toBe("");
        expect(initial.transportationDetailsGETStatus).toBe("");
        expect(initial.transportationDELETEStatus).toBe("");
        expect(initial.transportationPOSTStatus).toBe("");
        expect(initial.transportationPUTStatus).toBe("");
        expect(initial.refresh).toBe(false);
    });

    it("sets transportations GET attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getTransportationAttempt());
        expect(next.transportationGETStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets transportations GET success status & list of transportations", function () {
        let next = Reducer(getInitialState(), Actions.getTransportationSuccess({
            transportations: transportations
        }));
        expect(next.transportationGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.transportations).toBe(transportations);
        expect(next.refresh).toBe(false);
    });

    it("sets transportations GET failed status", function () {
        let next = Reducer(getInitialState(), Actions.getTransportationFailed());
        expect(next.transportationGETStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets transportation details GET attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getTransportationDetailsAttempt());
        expect(next.transportationDetailsGETStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets transportation details GET success status & transportation", function () {
        let next = Reducer(getInitialState(), Actions.getTransportationDetailsSuccess({
            transportation: transportation
        }));
        expect(next.transportationDetailsGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.transportation).toBe(transportation);
        expect(next.refresh).toBe(false);
    });

    it("sets transportation details GET failed status", function () {
        let next = Reducer(getInitialState(), Actions.getTransportationDetailsFailed());
        expect(next.transportationDetailsGETStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets transportation POST attempt status", function () {
        let next = Reducer(getInitialState(), Actions.createTransportationAttempt());
        expect(next.transportationPOSTStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets transportation POST success status & transportation", function () {
        let next = Reducer(getInitialState(), Actions.createTransportationSuccess({
            transportation: transportation
        }));
        expect(next.transportationPOSTStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.transportation).toBe(transportation);
        expect(next.refresh).toBe(true);
    });

    it("sets transportation POST failed status", function () {
        let next = Reducer(getInitialState(), Actions.createTransportationFailed());
        expect(next.transportationPOSTStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets transportation PUT attempt status", function () {
        let next = Reducer(getInitialState(), Actions.updateTransportationAttempt());
        expect(next.transportationPUTStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets transportation PUT success status & transportation", function () {
        let next = Reducer(getInitialState(), Actions.updateTransportationSuccess({
            transportation: transportation
        }));
        expect(next.transportationPUTStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.transportation).toBe(transportation);
        expect(next.refresh).toBe(true);
    });

    it("sets transportation PUT failed status", function () {
        let next = Reducer(getInitialState(), Actions.updateTransportationFailed());
        expect(next.transportationPUTStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets transportation DELETE attempt status", function () {
        let next = Reducer(getInitialState(), Actions.deleteTransportationAttempt());
        expect(next.transportationDELETEStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets transportation DELETE success status & transportation", function () {
        let next = Reducer(getInitialState(), Actions.deleteTransportationSuccess());
        expect(next.transportationDELETEStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.refresh).toBe(true);
    });

    it("sets transportation DELETE failed status", function () {
        let next = Reducer(getInitialState(), Actions.deleteTransportationFailed());
        expect(next.transportationDELETEStatus).toBe(FETCH_STATUS.FAILED);
    });
});