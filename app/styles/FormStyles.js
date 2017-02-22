import { StyleSheet } from "react-native";
import { $white, $darkteal } from "./GlobalStyles.js";


export const FormStyles = StyleSheet.create({
    container: {
        justifyContent: "center",
        marginTop: 50,
        padding: 20,
        backgroundColor: $white
    },
    title: {
        fontSize: 30,
        alignSelf: "center",
        marginBottom: 30
    },
    buttonText: {
        fontSize: 18,
        color: $white,
        alignSelf: "center"
    },
    button: {
        height: 36,
        backgroundColor: $darkteal,
        borderColor: $darkteal,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: "stretch",
        justifyContent: "center"
    }
});