/*
 * Inspired by & source credit: http://browniefed.com/blog/react-native-layout-examples/
*/
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.5)"
    },
    background: {
        width: null,
        height: null,
    },
    markWrap: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.5)",
        paddingTop: 30,
        paddingBottom: 40
    },
    brandWrap: {
        textAlign: "center",
        fontSize: 80,
        fontFamily: "serif",
        fontWeight: "bold",
        color: "white",
    },
    planText: {
        color: "#39a7a3",
    },
    itText: {
        color: "white",
    },
    brandIcon: {
        fontSize: 70,
        color: "#39a7a3",
        height: 40,
        width: 40,
        marginHorizontal: 50
    },
    signUpText: {
        paddingLeft: 20,
        fontSize: 40,
        fontFamily: "serif",
        fontWeight: "bold",
        color: "#39a7a3",
    },
    inputsContainer: {
        flex: 2,
        backgroundColor: "rgba(0,0,0,.5)"
    },
    footerContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.5)"
    },
    headerTitleView: {
        backgroundColor: "transparent",
        marginTop: 25,
        marginLeft: 25,
    },
    planItText: {
        textAlign: "center",
        fontSize: 80,
        fontFamily: "serif",
        fontWeight: "bold",
        color: "#39a7a3",
    },
    inputContainer: {
        flexDirection: "row",
        height: 50,
        paddingRight: 20
    },
    iconContainer: {
        paddingLeft: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    inputIcon: {
        height: 22,
        width: 22,
        fontSize: 22,
        color: "white"
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        fontWeight: "normal",
        fontSize: 16
    },
    picker: {
        width,
        color: "white",
        borderBottomWidth: 1,
        borderBottomColor: "white"
    },
    signup: {
        backgroundColor: "#39a7a3",
        paddingVertical: 25,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    signin: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    accountText: {
        fontWeight: "normal",
        color: "white",
        fontSize: 18
    },
    signinLinkText: {
        fontWeight: "normal",
        color: "#39a7a3",
        marginLeft: 5,
        fontSize: 18
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
});