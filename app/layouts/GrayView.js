import React, { Component } from "react";
import { View, Text } from "react-native";
import { GlobalStyles, $gray } from "../styles/GlobalStyles.js";


export default class GrayView extends Component {

    constructor (props) {
        super(props);
    }
    
    render () {
        return (
            <View style={[GlobalStyles.container, { backgroundColor: $gray }]}>
                <Text style={GlobalStyles.text}>Gray view</Text>
            </View>
        );
    }
}