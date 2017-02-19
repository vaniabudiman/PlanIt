import React, { Component } from "react";
import { ListView, Text, View, StyleSheet } from "react-native";

const $whitesmoke = "whitesmoke";
const $black = "black";

var styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: $whitesmoke,
    },
    text: {
        flex: 1,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: $black,
    },
    border: {
        borderWidth: StyleSheet.hairlineWidth,
        padding: 5,
    }
});

class BasicListView extends Component {

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
            <View style={styles.separator} />
        );
    }

    render () {
        return (
            <View style={styles.row, styles.border}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <Text style={styles.text, styles.rowSeparator}>{rowData}</Text>}
                    renderSeparator={this.renderSeparator}
                />
            </View>
        );
    }

}


export default BasicListView;