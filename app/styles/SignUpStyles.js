/*
 * Inspired by & source credit: http://browniefed.com/blog/react-native-layout-examples/
*/
import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container: {
        flex: 1,
    },
    bg: {
        paddingTop: 30,
        width: null,
        height: null
    },
    headerContainer: {
        flex: 1,
    },
    inputsContainer: {
        flex: 3,
        marginTop: 50,
    },
    footerContainer: {
        flex: 1
    },
    headerIconView: {
        marginLeft: 10,
        backgroundColor: "transparent"
    },
    headerBackButtonView: {
        width: 25,
        height: 25,
    },
    backButtonIcon: {
        width: 25,
        height: 25
    },
    headerTitleView: {
        backgroundColor: "transparent",
        marginTop: 25,
        marginLeft: 25,
    },
    titleViewText: {
        fontSize: 40,
        color: "#fff",
    },
    inputs: {
        paddingVertical: 20,
    },
    inputContainer: {
        borderWidth: 1,
        borderBottomColor: "#CCC",
        borderColor: "transparent",
        flexDirection: "row",
        height: 75,
    },
    iconContainer: {
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    inputIcon: {
        width: 30,
        height: 30,
    },
    input: {
        flex: 1
    },
    signup: {
        backgroundColor: "#FF3366",
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
    greyFont: {
        color: "#D8D8D8"
    },
    whiteFont: {
        color: "#FFF"
    }
});