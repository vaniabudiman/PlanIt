/**
 * PlanIt app entry point
 */

import React, { Component } from "react";
import { AppRegistry, View, Text } from "react-native";


class PlanIt extends Component {
    render () {
        return (
            <View>
                <Text>Welcome to the app!</Text>
            </View>
        );
    }
}

AppRegistry.registerComponent("PlanIt", () => PlanIt);


export default PlanIt;