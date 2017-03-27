import "react-native";
import Reducer from "../../app/reducers/eventsReducer.js";
import Actions, {
    buildGETRequestURL,
    buildPOSTRequestURL,
    buildPUTRequestURL,
    buildDELETERequestURL
} from "../../app/actions/eventsActions.js";
import FETCH_STATUS from "../../app/constants/fetchStatusConstants.js";
import { apiURL } from "../../app/config/ServerConfig.js";


describe("Events Reducer", function () {
    let events = [ { eventId: 0 }, { eventId: 1 } ];
    let event = { eventId: 0 };
    let eventId = 123;
    let tripId = 456;

    function getInitialState () {
        return Reducer(undefined, {});
    }

    describe("buildGETRequestURL", function () {
        it("builds correct URL with tripId", function () {
            expect(buildGETRequestURL(tripId)).toBe(
                apiURL + "events" +
                "?tripID=" + tripId
            );
        });

        it("builds correct URL with eventId", function () {
            expect(buildGETRequestURL(null, eventId)).toBe(
                apiURL + "events" +
                "?eventID=" + eventId
            );
        });

        it("builds correct URL with tripId & eventId", function () {
            expect(buildGETRequestURL(tripId, eventId)).toBe(
                apiURL + "events" +
                "?tripID=" + tripId +
                ",eventID=" + eventId
            );
        });
    });

    describe("buildPOSTRequestURL", function () {
        it("builds correct URL", function () {
            expect(buildPOSTRequestURL()).toBe(apiURL + "events");
        });
    });

    it("buildPUTRequestURL", function () {
        it("builds correct URL", function () {
            expect(buildPUTRequestURL(eventId)).toBe(apiURL + "events/" + eventId);
        });
    });

    describe("buildDELETERequestURL", function () {
        it("builds correct URL", function () {
            expect(buildDELETERequestURL(eventId)).toBe(apiURL + "events/" + eventId);
        });
    });

    it("has correct initial state", function () {
        let initial = getInitialState();

        expect(initial.events).toEqual([]);
        expect(initial.event).toEqual({});
        expect(initial.eventsGETStatus).toBe("");
        expect(initial.eventDetailsGETStatus).toBe("");
        expect(initial.eventDELETEStatus).toBe("");
        expect(initial.eventPOSTStatus).toBe("");
        expect(initial.eventPUTStatus).toBe("");
        expect(initial.refresh).toBe(false);
    });

    it("sets events GET attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getEventsAttempt());
        expect(next.eventsGETStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets events GET success status & list of events", function () {
        let next = Reducer(getInitialState(), Actions.getEventsSuccess({
            events: events
        }));
        expect(next.eventsGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.events).toBe(events);
        expect(next.refresh).toBe(false);
    });

    it("sets events GET failed status", function () {
        let next = Reducer(getInitialState(), Actions.getEventsFailed());
        expect(next.eventsGETStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets event details GET attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getEventDetailsAttempt());
        expect(next.eventDetailsGETStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets event details GET success status & event", function () {
        let next = Reducer(getInitialState(), Actions.getEventDetailsSuccess({
            event: event
        }));
        expect(next.eventDetailsGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.event).toBe(event);
        expect(next.refresh).toBe(false);
    });

    it("sets event details GET failed status", function () {
        let next = Reducer(getInitialState(), Actions.getEventDetailsFailed());
        expect(next.eventDetailsGETStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets event POST attempt status", function () {
        let next = Reducer(getInitialState(), Actions.createEventAttempt());
        expect(next.eventPOSTStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets event POST success status & event", function () {
        let next = Reducer(getInitialState(), Actions.createEventSuccess({
            event: event
        }));
        expect(next.eventPOSTStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.event).toBe(event);
        expect(next.refresh).toBe(true);
    });

    it("sets event POST failed status", function () {
        let next = Reducer(getInitialState(), Actions.createEventFailed());
        expect(next.eventPOSTStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets event PUT attempt status", function () {
        let next = Reducer(getInitialState(), Actions.updateEventAttempt());
        expect(next.eventPUTStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets event PUT success status & event", function () {
        let next = Reducer(getInitialState(), Actions.updateEventSuccess({
            event: event
        }));
        expect(next.eventPUTStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.event).toBe(event);
        expect(next.refresh).toBe(true);
    });

    it("sets event PUT failed status", function () {
        let next = Reducer(getInitialState(), Actions.updateEventFailed());
        expect(next.eventPUTStatus).toBe(FETCH_STATUS.FAILED);
    });

    it("sets event DELETE attempt status", function () {
        let next = Reducer(getInitialState(), Actions.deleteEventAttempt());
        expect(next.eventDELETEStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets event DELETE success status & event", function () {
        let next = Reducer(getInitialState(), Actions.deleteEventSuccess());
        expect(next.eventDELETEStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.refresh).toBe(true);
    });

    it("sets event DELETE failed status", function () {
        let next = Reducer(getInitialState(), Actions.deleteEventFailed());
        expect(next.eventDELETEStatus).toBe(FETCH_STATUS.FAILED);
    });
});