import "react-native";
import FETCH_STATUS from "../app/constants/fetchStatusConstants.js";


describe("FETCH_STATUS_CONSTANTS", function () {

    it("has correct constants", function () {
        expect(FETCH_STATUS.ATTEMPTING).toBe("ATTEMPTING");
        expect(FETCH_STATUS.SUCCESS).toBe("SUCCESS");
        expect(FETCH_STATUS.FAILED).toBe("FAILED");
    });
});