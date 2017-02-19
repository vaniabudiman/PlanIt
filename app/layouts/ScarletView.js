import React, { Component } from "react";
import { View, Text } from "react-native";
import { GlobalStyles, $scarlet } from "../styles/GlobalStyles.js";


export default class ScarletView extends Component {

    constructor (props) {
        super(props);
    }

    render () {
        return (
            <View style={[GlobalStyles.container, { backgroundColor: $scarlet }]}>
                <Text style={GlobalStyles.text}>Scarlet view</Text>
            </View>
        );
    }
}