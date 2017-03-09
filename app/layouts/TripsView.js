import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import realm from "../../Realm/realm.js";
import { connect } from "react-redux";
import { getTrips } from "../actions/tripsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


/*
 * NOTE: This is a simple demo on how to use SOME of the props the ListMapTemplate has for implementing the Trips View
 *       There may be props available in the ListMapTemplate that I've missed in the demo, so read through the
 *       props list in that file for the fullest complete set of props available. I've tried to document them in
 *       JSDoc style comments at the top of the file for convenience - although again some may be missed in the comments
 *       so the "propTypes" list should be the most complete... since we disallow using props not documented in this object
*/


// TODO: remove these mocks
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

        // TODO: remove... this is just an example
        //      - the items will probs be coming from server (or Realm) if offline
        //      - how we do the loading state may be different / vary depending on how data is loaded in from server/Realm
        this.state = {
            items: items,   // TODO: change this to an empty list to see an example of the empty message
            loadingTrips: false,

            trips: this.props.trips,
        };

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleAdd = this._handleAdd.bind(this);
        this._handleInfo = this._handleInfo.bind(this);
        this._handleShare = this._handleShare.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleCreateItem = this._handleCreateItem.bind(this);

        this._getTrips = () => this.props.dispatch(getTrips()); // TODO: use this somewhere
    }

    componentWillReceiveProps (nextProps) {
        this.requireAuthentication(nextProps);
        this.setState({ trips: nextProps.trips });
    }

    requireAuthentication (nextProps) {
        if (nextProps.tripsGETStatus === FETCH_STATUS.SUCCESS) {
            this.setState({ trips: nextProps.trips });
            // TODO: push new trips to view
        }
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleSearch (str) {
        let newItems = items.filter(function (item) {
            return item.title.toLowerCase().indexOf(str.toLowerCase()) !== -1;
        });

        this.setState({ items: newItems });
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
    _handleAdd (id) {
        // Make necessary calls to add the item identified by id
        alert("adding: " + id);
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
        alert("create an item");
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleMap (newMapToggleState) {
        // Make necessary calls to do w/e you want based on this new map toggled state
        alert("map toggled to: " + newMapToggleState);
    }

    render () {
        return (
            <ListMapTemplate data={this.state.items}
                emptyListMessage={"Create a trip to begin!"}
                loadingData={this.state.loadingTrips}
                enableSearch={true}
                onSearch={this._handleSearch}
                enableMap={true}
                mapProps={mapProps}
                onRefresh={this._handleRefresh}
                showAdd={true}
                showInfo={true}
                showShare={true}
                onAdd={this._handleAdd}
                onInfo={this._handleInfo}
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