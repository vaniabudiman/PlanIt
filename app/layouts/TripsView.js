import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import ListMapTemplate from "../templates/ListMapTemplate.js";
//import realm from "../../Realm/realm.js";
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

class TripsView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        trips: React.PropTypes.array,
        tripsGETStatus: React.PropTypes.string,
        refresh: React.PropTypes.bool
    }

    constructor (props) {
        super(props);

        this.state = {
            trips: this.props.trips,
            searchString: ""
        };

        this.requestTrips(this.props.dispatch);

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleUpdate = this._handleUpdate.bind(this);
        this._handleShare = this._handleShare.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleCreateItem = this._handleCreateItem.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.refresh) {
            this.requestTrips(nextProps.dispatch);
        }

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
                subtitle: new Date(trip.startDate).toDateString() + " - " + new Date(trip.endDate).toDateString(),
                tripName: trip.tripName,
                startDate: trip.startDate,
                endDate: trip.endDate
            };
        });
    }

    // contains search on tripName
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
        // Just fire off another fetch to refresh
        this.requestTrips(this.props.dispatch);

        this.setState({ searchString: "" });
    }

    // Take user to trip update form (creation w/ prefill)
    _handleUpdate (trip) {
        Actions.tripForm({ trip: trip, title: "Update Trip" });
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleShare (id) {
        // Make necessary calls to share the item identified by id
        alert("share: " + id);
    }

    // Take user to trip homepage
    _handleClickItem (item) {
        Actions.tripHome({ tripId: item.id, title: "Create Trip" });
    }

     // Take user to trip creation form
    _handleCreateItem () {
        Actions.tripForm();
    }

    render () {
        return (
            <ListMapTemplate data={this.formattedTrips()}
                emptyListMessage={this.props.tripsGETStatus === FETCH_STATUS.SUCCESS ? "Create a trip to begin!" : ""}
                loadingData={this.props.tripsGETStatus === FETCH_STATUS.ATTEMPTING}
                enableSearch={true}
                onSearch={this._handleSearch}
                onRefresh={this._handleRefresh}
                showEdit={true}
                //showShare={true}
                onEdit={this._handleUpdate}
                //onShare={this._handleShare}
                onClickItem={this._handleClickItem}
                onCreateItem={this._handleCreateItem}
                searchString={this.state.searchString} />
        );
    }
}

export default connect((state) => {
    return {
        trips: state.trips.trips,
        tripsGETStatus: state.trips.tripsGETStatus,
        refresh: state.trips.refresh
    };
})(TripsView);
