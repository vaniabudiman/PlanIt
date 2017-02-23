import React, { Component } from "react";
import { ListViewStyles } from "../styles/ListViewStyles.js";
import Icon from "react-native-vector-icons/FontAwesome";
import { ListView, Title, Subtitle, Divider, View, Row } from "@shoutem/ui";
import realm from "../../Realm/realm.js";


export default class BasicListView extends Component {

    constructor (props) {
        super(props);

        let trips = realm.objects("Trip");
        let items = [];
        Object.keys(trips).map(function (key) {
            items.push(trips[key].tripName);
        });

        this.state = {
            items: items
        };
    }

    renderRow (item) {
        return (
            <Row>
                <View styleName="horizontal space-between">
                    <View styleName="vertical">
                        <Title>{item}</Title>
                        <Subtitle>subtitle to {item}</Subtitle>
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