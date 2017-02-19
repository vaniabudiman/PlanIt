import { StyleSheet } from "react-native";
import { $whitesmoke, $black } from "./GlobalStyles.js";


export default StyleSheet.create({
    row: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: $whitesmoke,
    },
    text: {
        flex: 1,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: $black,
    },
    border: {
        borderWidth: StyleSheet.hairlineWidth,
        padding: 5,
    }
});