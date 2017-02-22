import React, { Component } from "react";
import { View, Text } from "react-native";
import { GlobalStyles } from "../styles/GlobalStyles.js";


export default class UserProfileView extends Component {

    constructor (props) {
        super(props);
    }

    render () {
        return (
            <View style={GlobalStyles.container}>
                <Text style={GlobalStyles.text}>TODO: placeholder for User Profile</Text>
            </View>
        );
    }
}