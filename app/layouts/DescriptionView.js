import React, { Component } from "react";
import { DescriptionStyles } from "../styles/DescriptionStyles.js";
import { View, Text } from "react-native";
import { ListView, Subtitle, Divider, Row } from "@shoutem/ui";


export default class DescriptionView extends Component {

    constructor (props) {
        super(props);
        this.state = {
            items: [
            { field: "field name", description: "field description goes here" },
            { field: "field name2", description: "field description2 goes here" },
            { field: "field name3", description: "field description3 goes here" },
            { field: "field name4", description: "field description4 goes here" },
            { field: "field name5", description: "field description5 goes here" }
            ]
        };
    }

    renderRow (item) {
        return (
            <Row>
                <View style={DescriptionStyles.row}>
                    <View style={DescriptionStyles.fieldContainer}>
                        <Subtitle>{item.field}</Subtitle>
                    </View>
                    <View>
                        <Text>{item.description}</Text>
                    </View>
                </View>
                <Divider styleName="line" />
            </Row>
        );
    }

    render () {
        return (
            <View style={DescriptionStyles.descriptionContainer}>
                <ListView
                    data={this.state.items}
                    renderRow={item => this.renderRow(item)}
                />
            </View>
        );
    }

}