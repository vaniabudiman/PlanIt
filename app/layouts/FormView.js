import React, { Component } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import t from "tcomb-form-native";
import { FormStyles } from "../styles/FormStyles.js";
import { $teal } from "../styles/GlobalStyles.js";


var Form = t.form.Form;

// Example - to be removed at some later point in time
var Person = t.struct({
    name: t.String,              // a required string
    surname: t.maybe(t.String),  // an optional string
    age: t.Number,               // a required number
    rememberMe: t.Boolean        // a boolean
});


export default class FormView extends Component {

    constructor (props) {
        super(props);
    }

    render () {
        return (
            <View style={FormStyles.container}>
                <Form ref="form" type={Person} />
                <TouchableHighlight style={FormStyles.button} onPress={this.onPress} underlayColor={$teal}>
                    <Text style={FormStyles.buttonText}>Save</Text>
                </TouchableHighlight>
            </View>
        );
    }
}
