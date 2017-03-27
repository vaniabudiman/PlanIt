import "react-native";
import FORM_CONSTANTS from "../app/constants/formConstants.js";


describe("FORM_CONSTANTS", function () {

    it("has correct constants", function () {
        expect(FORM_CONSTANTS.CHAR_LIMIT).toBe(40);
        expect(FORM_CONSTANTS.REPLACE_REGEX).toEqual(new RegExp(/\/|\s/g));
    });
});