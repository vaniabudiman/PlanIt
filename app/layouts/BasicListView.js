import React, { Component } from "react";
import { ListView, Text, View } from "react-native";
import { GlobalStyles } from "../styles/GlobalStyles.js";
import ListViewStyles from "../styles/ListViewStyles.js";
import Icon from "react-native-vector-icons/FontAwesome";


export default class BasicListView extends Component {

    constructor (props) {
        super(props);
        const ds = new ListView.DataSource( { rowHasChanged: (r1, r2) => r1 !== r2 } );
        this.state = {
            dataSource: ds.cloneWithRows([
                "Data1", "Data2", "Data3", "Data4", "Data5", "Data6", "Data7", "Data8"
            ])
        };
    }

    renderSeparator () {
        return (
            <View style={ListViewStyles.separator} />
        );
    }

    render () {
        return (
            <View style={[GlobalStyles.container, ListViewStyles.row, ListViewStyles.border]}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) =>
                        <View style={ListViewStyles.rowContainer}>
                            <Text style={ListViewStyles.text, ListViewStyles.rowSeparator}>{rowData}</Text>
                            <View style={ListViewStyles.actionIconsContainer}>
                                <Icon name="plus" style={ListViewStyles.optionIcons} />
                                <Icon name="info-circle" style={ListViewStyles.optionIcons} />
                                <Icon name="share-alt" style={ListViewStyles.optionIcons} />
                            </View>
                        </View>
                        }
                    renderSeparator={this.renderSeparator}
                />
            </View>
        );
    }

}