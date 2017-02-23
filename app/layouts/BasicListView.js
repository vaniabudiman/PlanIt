import React, { Component } from "react";
import { ListViewStyles } from "../styles/ListViewStyles.js";
import Icon from "react-native-vector-icons/FontAwesome";
import { ListView, Title, Subtitle, Divider, View, Row } from "@shoutem/ui";


export default class BasicListView extends Component {

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
                <View styleName="horizontal space-between">
                    <View styleName="vertical">
                        <Title>{item.field}</Title>
                        <Subtitle>{item.description}</Subtitle>
                    </View>
                    <View styleName="horizontal">
                        <Icon styleName="disclosure" name="plus" style={ListViewStyles.optionIcons} size={16} />
                        <Icon styleName="disclosure" name="info-circle" style={ListViewStyles.optionIcons} size={16} />
                        <Icon styleName="disclosure" name="share-alt" style={ListViewStyles.optionIcons} size={16} />
                    </View>
                </View>
                <Divider styleName="line" />
            </Row>
        );
    }

    render () {
        return (
            <View>
                <ListView
                    data={this.state.items}
                    renderRow={item => this.renderRow(item)}
                    onRefresh={() => {
                        setTimeout(() => {
                            this.setState({
                                loading: true,
                                items: [{ name: "test" }]
                            });
                        }, 300);
                    }}
                />
            </View>
        );
    }

}