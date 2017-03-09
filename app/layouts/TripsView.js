import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import ListMapTemplate from "../templates/ListMapTemplate.js";
//import realm from "../../Realm/realm.js";
import { connect } from "react-redux";
import { getTrips } from "../actions/tripsActions";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


/*
 * NOTE: This is a simple demo on how to use SOME of the props the ListMapTemplate has for implementing the Trips View
 *       There may be props available in the ListMapTemplate that I've missed in the demo, so read through the
 *       props list in that file for the fullest complete set of props available. I've tried to document them in
 *       JSDoc style comments at the top of the file for convenience - although again some may be missed in the comments
 *       so the "propTypes" list should be the most complete... since we disallow using props not documented in this object
*/


// TODO: remove these mocks - leaving as example for how to access realm
/*
let trips = realm.objects("Trip");
let items = [];
Object.keys(trips).map(function (key, i) {
    let trip = trips[key];

    items.push({
        id: i,
        title: trip.tripName,
        subtitle: "subtitle: " + trip.tripName
    });
});
*/


// TODO: remove this mock OR edit it (adding necessary props from the MapView api) to suite the trips view's needs
var mapProps = {
    // TODO: for the map enabled views it will be best if we can do someting like this to get a descent default
    //       location centering & scaling (per locations... e.g. trips/bookmars/etc.)
    region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
    }
};


class TripsView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        trips: React.PropTypes.array,
        tripsGETStatus: React.PropTypes.string,
    }

    constructor (props) {
        super(props);

        this.state = {
            loadingTrips: false,
            trips: this.props.trips,
        };

        this.requestTrips(this.props.dispatch);

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleAdd = this._handleAdd.bind(this);
        this._handleInfo = this._handleInfo.bind(this);
        this._handleShare = this._handleShare.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleCreateItem = this._handleCreateItem.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        this.requireAuthentication(nextProps);
        this.setState({ trips: nextProps.trips });
    }

    requestTrips (dispatch) {
        dispatch(getTrips());
    }

    formattedTrips () {
        return this.state.trips.map((trip) => {
            return {
                id: trip.tripID,
                title: trip.tripName,
                subtitle: new Date(trip.startDate).toDateString() + " - " + new Date(trip.endDate).toDateString()
            };
        });
    }

    requireAuthentication (nextProps) {
        if (nextProps.tripsGETStatus === FETCH_STATUS.SUCCESS) {
            this.setState({ trips: nextProps.trips });
            // TODO: push new trips to view
        }
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleSearch (str) {
        str = str.trim().toLowerCase();

        if (str === "") {
            // empty search value, so return all current cities from props
            this.setState({ trips: this.props.trips, searchString: str });
        } else {
            let matchedTrips = this.state.trips.filter((trip) => {
                // Match on city "name" or "adminName1" fields
                return (trip.tripName.toLowerCase().indexOf(str) !== -1) ||
                    (trip.tripName.toLowerCase().indexOf(str) !== -1);
            });
            this.setState({ trips: matchedTrips, searchString: str });
        }
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleRefresh () {
        // Make necessary calls to fetch & fresh data from server/Realm as necessary
        alert("refreshing");
        this.setState({ loadingTrips: true });
        setTimeout(() => this.setState({ loadingTrips: false }), 1000);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleLoadMore () {
        // Make necessary calls to fetch more data from server/Realm as necessary
        alert("loading more");
        this.setState({ loadingTrips: true });
        setTimeout(() => this.setState({ loadingTrips: false }), 1000);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleUpdate (id) {
        // Make necessary calls to add the item identified by id
        alert("updating: " + id);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleInfo (id) {
        // Make necessary calls to get/navigate to info on item identified by id
        alert("info for: " + id);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleShare (id) {
        // Make necessary calls to share the item identified by id
        alert("share: " + id);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by id
        // alert("clicked on item: " + item.id);
        Actions.tripHome({ tripId: item.id });
    }

     // TODO: remove/edit... this is just an example on how the callback would work
    _handleCreateItem () {
        // Make necessary calls to navigate to item creation screen
        Actions.tripForm();
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleMap (newMapToggleState) {
        // Make necessary calls to do w/e you want based on this new map toggled state
        alert("map toggled to: " + newMapToggleState);
    }

    render () {
        return (
            <ListMapTemplate data={this.formattedTrips()}
                emptyListMessage={"Create a trip to begin!"}
                loadingData={this.state.loadingTrips}
                enableSearch={true}
                onSearch={this._handleSearch}
                enableMap={true}
                mapProps={mapProps}
                onRefresh={this._handleRefresh}
                showEdit={true}
                showShare={true}
                onEdit={this._handleUpdate}
                onShare={this._handleShare}
                onToggleMap={this._handleToggleMap}
                onClickItem={this._handleClickItem}
                onCreateItem={this._handleCreateItem} />
        );
    }
}

export default connect((state) => {
    return {
        trips: state.trips.trips,
        tripsGETStatus: state.trips.tripsGETStatus
    };
})(TripsView);
