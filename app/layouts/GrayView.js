import React, { Component } from "react";
import { View } from "react-native";
import { GlobalStyles, $gray } from "../styles/GlobalStyles.js";
import { Examples } from "@shoutem/ui";


export default class GrayView extends Component {

    constructor (props) {
        super(props);
    }
    
    render () {
        return (
            <View style={[GlobalStyles.container, { backgroundColor: $gray }]}>
                <Examples />
            </View>
        );
    }
}