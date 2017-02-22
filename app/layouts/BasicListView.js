import React, { Component } from "react";
import ListViewStyles from "../styles/ListViewStyles.js";
import Icon from "react-native-vector-icons/FontAwesome";
import { ListView, Title, Subtitle, Screen, Divider, View, Row } from "@shoutem/ui";


export default class BasicListView extends Component {

    constructor (props) {
        super(props);
        this.state = {
            items: ["Data1", "Data2", "Data3", "Data4", "Data5", "Data6", "Data7", "Data8"]
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
            <Screen styleName="full-screen" style={ListViewStyles.screen}>
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
            </Screen>
        );
    }

}