import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import { ListView, GridRow, Tile, Title, TouchableOpacity } from "@shoutem/ui";
import { $white } from "../styles/GlobalStyles.js";
import TripHomeTiles from "../data/TripHomeTiles.js";
import { isDevMode } from "../utils/utils.js";


export default class TripHomeView extends Component {

    static propTypes = {
        tripId: React.PropTypes.number
    }

    componentDidMount () {
        // TODO: remove this... just testing for now
        isDevMode() && alert("trips home for trip id: " + this.props.tripId);
    }

    constructor (props) {
        super(props);

        // Bind helpers to 'this'
        this._getCell = this._getCell.bind(this);
        this._getRow = this._getRow.bind(this);
    }

    getRoute (id) {
        let defaultProps = { tripId: this.props.tripId };
        let route;

        switch (id) {
            case "Itinerary":
                route = () => Actions.itinerary(defaultProps);
                break;
            case "Bookmarks":
                route = () => Actions.bookmarks(defaultProps);
                break;
            case "Currency Conversion":
                route = () => Actions.login(defaultProps);   // TODO: change to bookmark view when implemented
                break;
            case "Browse":
                route = () => Actions.continents(defaultProps);
                break;
            case "Transit":
                route = () => Actions.login(defaultProps);   // TODO: change to bookmark view when implemented
                break;
            case "Map":
                route = () => Actions.login(defaultProps);   // TODO: change to bookmark view when implemented
                break;
        }
        return route;
    }

    _getCell (cell) {
        let handleRoute = this.getRoute(cell.id);

        return (
            <TouchableOpacity key={cell.id} onPress={handleRoute}>
                <Tile styleName="text-centric" style={{ backgroundColor: cell.color }}>
                    <Title styleName="multiline" style={{ color: $white }}>{cell.id}</Title>
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