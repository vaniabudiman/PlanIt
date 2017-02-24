import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import { ListView, GridRow, Tile, Title, TouchableOpacity } from "@shoutem/ui";
import TripHomeTiles from "../data/TripHomeTiles.js";


export default class TripHomeView extends Component {

    constructor (props) {
        super(props);

        // Bind helpers to 'this'
        this._getCell = this._getCell.bind(this);
        this._getRow = this._getRow.bind(this);
    }

    _getCell (cell) {
        //TODO: route to appropriate view "onPress" of tile
        return (
            <TouchableOpacity key={cell.id} onPress={Actions.basicList}>
                <Tile styleName="text-centric" style={{ backgroundColor: cell.color }}>
                    <Title styleName="multiline">{cell.id}</Title>
                    <Icon name={cell.icon} size={100} />
                </Tile>
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
        const groupedData = GridRow.groupByRows(TripHomeTiles, 2);

        return (
            <ListView
                data={groupedData}
                renderRow={this._getRow} />
        );
    }
}