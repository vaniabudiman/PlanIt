import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { connect } from "react-redux";
import { getTrips, deleteTrip } from "../actions/tripsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { NetInfo } from "react-native";
import realm from "../../Realm/realm.js";
import { ScrollView, View, Divider, Title, Subtitle, Caption } from "@shoutem/ui";


/*
 * NOTE: This is a simple demo on how to use SOME of the props the ListMapTemplate has for implementing the Trips View
 *       There may be props available in the ListMapTemplate that I've missed in the demo, so read through the
 *       props list in that file for the fullest complete set of props available. I've tried to document them in
 *       JSDoc style comments at the top of the file for convenience - although again some may be missed in the comments
 *       so the "propTypes" list should be the most complete... since we disallow using props not documented in this object
*/


class TripsView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        trips: React.PropTypes.array,
        tripsGETStatus: React.PropTypes.string,
        tripDELETEStatus: React.PropTypes.string,
        refresh: React.PropTypes.bool
    }

    constructor (props) {
        super(props);

        this.state = {
            trips: this.props.trips,
            searchString: "",
            isConnected: null
        };

        this.requestTrips(this.props.dispatch);

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleUpdate = this._handleUpdate.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleShare = this._handleShare.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleCreateItem = this._handleCreateItem.bind(this);

        this.renderOnlineView = this.renderOnlineView.bind(this);
        this.renderOfflineView = this.renderOfflineView.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.refresh) {
            this.requestTrips(nextProps.dispatch);
        }

        if (this.props.tripsGETStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.tripsGETStatus === FETCH_STATUS.SUCCESS) {
            this.updateRealmDB(nextProps);
        }

        if (this.props.tripDELETEStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.tripDELETEStatus === FETCH_STATUS.SUCCESS) {
            this.updateRealmDB(nextProps);
        }

        this.setState({ trips: nextProps.trips });
    }

    updateRealmDB (updatedTripProps) {
        let allTrips = realm.objects("Trip");
        realm.write(() => {
            realm.delete(allTrips);
            updatedTripProps.trips.map((trip) => {
                realm.create("Trip", {
                    tripID: trip.tripID,
                    tripName: trip.tripName,
                    active: trip.active,
                    startDate: new Date(trip.startDate),
                    endDate: new Date(trip.endDate)
                });
            });
        });
    }

    componentDidMount () {
        NetInfo.isConnected.addEventListener(
            "change",
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );
    }

    componentWillUnmount () {
        NetInfo.isConnected.removeEventListener(
            "change",
            this._handleConnectivityChange
        );
    }

    _handleConnectivityChange = (isConnected) => {
        this.setState({
            isConnected,
        });
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

    _handleDelete (item) {
        this.props.dispatch(deleteTrip(item.id));
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
        Actions.tripHome({ tripId: item.id, title: "Trip Homepage",
            tripStartDate: item.startDate, tripEndDate: item.endDate });
    }

     // Take user to trip creation form
    _handleCreateItem () {
        Actions.tripForm();
    }

    renderTrips () {
        return realm.objects("Trip").map((trip) => {
            return (
                <View style={{ paddingBottom: 5 }} key={trip.tripID}>
                    <Title>Trip: {trip.tripName}</Title>
                    <Subtitle>Start: {trip.startDate.toUTCString()}</Subtitle>
                    <Caption>End: {trip.endDate.toUTCString()}</Caption>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderBookmarks () {
        return realm.objects("Bookmark").map(function (bookmark) {
            return (
                <View style={{ paddingBottom: 5, paddingTop: 5 }} key={bookmark.bookmarkID}>
                    <Title>Bookmark: {bookmark.name}</Title>
                    <Subtitle>Address: {bookmark.address}</Subtitle>
                    <Caption>Type: {bookmark.type}</Caption>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderEvents () {
        return realm.objects("Event").map((event) => {
            return (
                <View style={{ paddingBottom: 5 }} key={event.eventID}>
                    <Title>Event: {event.eventName}</Title>
                    <Subtitle>Start: {event.startDateTime.toUTCString()}</Subtitle>
                    <Caption>End: {event.endDateTime.toUTCString()}</Caption>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderOnlineView () {
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
                showDelete={true}
                onDelete={this._handleDelete}
                onClickItem={this._handleClickItem}
                onCreateItem={this._handleCreateItem}
                searchString={this.state.searchString} />
        );
    }

    renderTransportation () {
        return realm.objects("Transportation").map(function (transportation) {
            return (
                <View style={{ paddingBottom: 5, paddingTop: 5 }} key={transportation.transportationID}>
                    <Title>{transportation.type}{transportation.operator
                        ? (": " + transportation.operator) : ""}</Title>
                    <Subtitle>Departure: {transportation.departureDateTime.toUTCString()}</Subtitle>
                    <Caption>Arrival: {transportation.arrivalDateTime.toUTCString()}</Caption>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderOfflineView () {
        let trips = this.renderTrips();
        let bookmarks = this.renderBookmarks();
        let events = this.renderEvents();
        let transportation = this.renderTransportation();
        return (
            <ScrollView>
                { trips }
                { events }
                { bookmarks }
                { transportation }
            </ScrollView>
        );
    }

    render () {
        let tripsView = null;
        if (this.state.isConnected) {
            tripsView = this.renderOnlineView();
        } else {
            tripsView = this.renderOfflineView();
        }
        return tripsView;
    }
}

export default connect((state) => {
    return {
        trips: state.trips.trips,
        tripsGETStatus: state.trips.tripsGETStatus,
        tripDELETEStatus: state.trips.tripDELETEStatus,
        refresh: state.trips.refresh
    };
})(TripsView);
