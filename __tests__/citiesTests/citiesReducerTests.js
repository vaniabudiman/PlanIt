import "react-native";
import Reducer from "../../app/reducers/citiesReducer.js";
import Actions, { buildRequestURL } from "../../app/actions/citiesActions.js";
import FETCH_STATUS from "../../app/constants/fetchStatusConstants.js";


describe("Cities Reducer", function () {
    let cities = [ { id: 0 }, { id: 1 } ];
    let countryId = 123;

    function getInitialState () {
        return Reducer(undefined, {});
    }

    describe("buildRequestURL", function () {
        it("builds correct URL", function () {
            expect(buildRequestURL(countryId)).toBe(
                "http://api.geonames.org/searchJSON" +
                "?country=" + countryId +
                "&featureCode=PPL" +
                "&orderby=relevance" +
                "&username=nikjmartin"  // this apiKey changes when rotated
            );
        });
    });

    it("has correct initial state", function () {
        let initial = getInitialState();

        expect(initial.cities).toEqual([]);
        expect(initial.citiesGETStatus).toBe("");
    });

    it("sets cities GET attempt status", function () {
        let next = Reducer(getInitialState(), Actions.getCitiesAttempt());
        expect(next.citiesGETStatus).toBe(FETCH_STATUS.ATTEMPTING);
    });

    it("sets cities GET success status & list of cities", function () {
        let next = Reducer(getInitialState(), Actions.getCitiesSuccess({
            geonames: cities
        }));
        expect(next.citiesGETStatus).toBe(FETCH_STATUS.SUCCESS);
        expect(next.cities).toBe(cities);
    });

    it("sets cities GET failed status", function () {
        let next = Reducer(getInitialState(), Actions.getCitiesFailed());
        expect(next.citiesGETStatus).toBe(FETCH_STATUS.FAILED);
    });
});