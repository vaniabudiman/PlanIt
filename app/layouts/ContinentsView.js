import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { ListView, GridRow, Tile, Image, Title, TouchableOpacity } from "@shoutem/ui";
import Continents from "../data/Continents.js";
import ContinentStyles from "../styles/ContinentStyles.js";


export default class ContinentsView extends Component {

    constructor (props) {
        super(props);

        // Bind helpers to 'this'
        this._getCell = this._getCell.bind(this);
        this._getRow = this._getRow.bind(this);
    }

    _getCell (cell) {
        //TODO: route to appropriate countries list view "onPress" of image
        return (
            <TouchableOpacity key={cell.id} onPress={Actions.basicList}
                    style={StyleSheet.flatten(ContinentStyles.touchOpacitySizing)}>
                <Image styleName="large"
                        style={StyleSheet.flatten(ContinentStyles.tileSpacing)}
                        source={{ uri: cell.images[Math.floor(Math.random()*cell.images.length)] }}>
                    <Tile>
                        <Title>{cell.id}</Title>
                    </Tile>
                </Image>
            </TouchableOpacity>
        );
    }

    _getRow (data) {
        const cells = data.map(this._getCell);

        return (
            <GridRow columns={2}>
                {cells}
            </GridRow>
        );
    }

    render () {
        // Group continents into rows of 2 columns
        const groupedData = GridRow.groupByRows(Continents, 2);

        return (
            <ListView
                data={groupedData}
                renderRow={this._getRow} />
        );
    }
}