import { StyleSheet } from "react-native";


export const MapViewStyles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    map: {
        ...StyleSheet.absoluteFillObject
    }
});