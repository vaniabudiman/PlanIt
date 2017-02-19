import React, { Component } from "react";
import { ListView, Text, View } from "react-native";
import { GlobalStyles } from "../styles/GlobalStyles.js";
import ListViewStyles from "../styles/ListViewStyles.js";


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
                        <Text style={ListViewStyles.text, ListViewStyles.rowSeparator}>{rowData}</Text>}
                    renderSeparator={this.renderSeparator}
                />
            </View>
        );
    }

}