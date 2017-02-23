import React, { Component } from "react";
import { View } from "react-native";
import MapView from "react-native-maps";
import MapViewStyles from "../styles/MapViewStyles.js";


export default class BasicMapView extends Component {

    render () {
        return (
            <View style ={ MapViewStyles.container }>
                <MapView style={ MapViewStyles.map }
                    region= {{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121
                    }}
                />
            </View>
        );
    }
}