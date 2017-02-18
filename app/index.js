/**
 * PlanIt app entry point
 */

import React, { Component } from "react";
import { AppRegistry, View, Text } from "react-native";
import Realm from "realm";


class PlanIt extends Component {
    render () {

        let realm = new Realm({
            schema: [{ name: "Dog", properties: { name: "string" } }]
        });

        realm.write(() => {
            realm.create("Dog", { name: "Rex" });
        });

        return (
            <View>
                <Text>Welcome to the app!</Text>
                <Text>Count of Dogs in Realm: {realm.objects("Dog").length}</Text>
            </View>
        );
    }
}

AppRegistry.registerComponent("PlanIt", () => PlanIt);


export default PlanIt;