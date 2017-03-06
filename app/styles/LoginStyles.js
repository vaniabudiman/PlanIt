/*
 * Inspired by & source credit: http://browniefed.com/blog/react-native-layout-examples/
*/
import { StyleSheet, Dimensions } from "react-native";


const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.5)"
    },
    markWrap: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "rgba(0,0,0,.5)"
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
    background: {
        width,
        height,
    },
    wrapper: {
        paddingVertical: 10,
        backgroundColor: "rgba(0,0,0,.5)"
    },
    inputWrap: {
        flexDirection: "row",
        marginTop: 20,
        height: 40,
        paddingRight: 20
    },
    iconWrap: {
        paddingLeft: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        height: 22,
        width: 22,
        fontSize: 22,
        color: "white"
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        fontWeight: "bold",
        fontSize: 18
    },
    button: {
        backgroundColor: "#39a7a3",
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    forgotPasswordText: {
        color: "#39a7a3",
        backgroundColor: "transparent",
        textAlign: "right",
        paddingRight: 20,
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10
    },
    signupWrap: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        paddingRight: 20,
    },
    accountText: {
        fontWeight: "bold",
        color: "white",
        fontSize: 18
    },
    signupLinkText: {
        fontWeight: "bold",
        color: "#39a7a3",
        marginLeft: 5,
        fontSize: 18
    },
});