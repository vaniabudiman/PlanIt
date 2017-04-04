import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getEvents, deleteEvent } from "../actions/eventsActions.js";
import { isDevMode, getRegionForCoordinates } from "../utils/utils.js";
import { NetInfo } from "react-native";
import realm from "../../Realm/realm.js";
import { ScrollView, View, Divider, Title, Subtitle, Caption } from "@shoutem/ui";

class EventsMapView extends Component {

    static propTypes = {
        tripId: React.PropTypes.number,
        tripStartDate: React.PropTypes.string,
        tripEndDate: React.PropTypes.string,
        events: React.PropTypes.array,
        eventsGETStatus: React.PropTypes.string,
        eventDELETEStatus: React.PropTypes.string,
        dispatch: React.PropTypes.func,
        refresh: React.PropTypes.bool,
        date: React.PropTypes.string
    }

    constructor (props) {
        super(props);

        this.state = {
            events: this.props.events,
            searchString: "",
            loadingItinerary: false,
            isConnected: null
        };

        this.requestEvents(this.props.dispatch, this.props.tripId);

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleShare = this._handleShare.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleCreateItem = this._handleCreateItem.bind(this);
        this._handleUpdate = this._handleUpdate.bind(this);
        this._handleConnectivityChange = this._handleConnectivityChange.bind(this);

        this.renderOnlineView = this.renderOnlineView.bind(this);
        this.renderOfflineView = this.renderOfflineView.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if ((nextProps.tripId && (this.props.tripId !== nextProps.tripId)) || nextProps.refresh) {
            this.requestEvents(nextProps.dispatch, nextProps.tripId);
        }

        if (this.props.eventsGETStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.eventsGETStatus === FETCH_STATUS.SUCCESS) {
            this.updateRealmDB(nextProps);
        }

        if (this.props.eventDELETEStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.eventDELETEStatus === FETCH_STATUS.SUCCESS) {
            this.updateRealmDB(nextProps);
            alert("Event deleted successfully");
        }

        // Always update state events w/ latest events from props (filtered by date)
        let filteredEvents = nextProps.events.filter((event) => {
            return new Date(event.startDateTime + " UTC").toDateString() === this.props.date;
        });

        this.setState({ events: filteredEvents });

        // Always update state events w/ latest events from props
        

        //this.setState({ events: nextProps.events });
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

    updateRealmDB (updatedEventProps) {
        let allEvents = realm.objects("Event");
        realm.write(() => {
            realm.delete(allEvents);
            updatedEventProps.events.map((event) => {
                realm.create("Event", {
                    eventID: event.eventID,
                    eventName: event.eventName,
                    startDateTime: new Date(event.startDateTime),
                    endDateTime: new Date(event.endDateTime)
                });
            });
        });
    }

    requestEvents (dispatch, tripId) {
        dispatch(getEvents(tripId));
    }

    formattedEvents () {
        return this.state.events.map((event) => {
            return {
                title: event.eventName,
                id: event.eventID,
                reminderFlag: event.reminderFlag,
                subtitle: "Begins: " + new Date(event.startDateTime + " UTC"),  // datetimes stored as UTC in DB - need to convert to local
                caption: "Ends: " + new Date(event.endDateTime + " UTC"),
                event: event
            };
        });
    }

    calculateMapViewPort () {
        if (this.state.events.length === 0) {
            return null;
        }

        let eventsWithLocation = this.state.events.filter((event) => {
            return event.lat && event.lon;
        });

        if (eventsWithLocation.length === 0) {
            return;
        }

        return getRegionForCoordinates(eventsWithLocation.map((event) => {
            return {
                latitude: event.lat,
                longitude: event.lon
            };
        }));
    }

    formattedEventMarkers () {
        let eventsWithLocation = this.state.events.filter((event) => {
            return event.lat && event.lon;
        });

        return eventsWithLocation.map((event) => {
            return {
                id: event.eventID,
                latlng: {
                    latitude: event.lat,
                    longitude: event.lon
                },
                title: event.eventName,
                description: event.address
            };
        });
    }

    _handleSearch (str) {
        str = str.trim().toLowerCase();

        if (str === "") {
            // empty search value, so return all current events from props
            this.setState({ events: this.props.events, searchString: str });
        } else {
            let matchedEvents = this.state.events.filter((event) => {
                // Match on event "name", address, & "types"
                return (event.eventName.toLowerCase().indexOf(str) !== -1);
            });
            this.setState({ events: matchedEvents, searchString: str });
        }
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestEvents(this.props.dispatch, this.props.tripId);

        this.setState({ searchString: "" });
    }

    _handleDelete (item) {
        this.props.dispatch(deleteEvent(item.id));
    }

    _handleToggleMap (showMap) {
        isDevMode() && alert("toggled map: " + showMap); // eslint-disable-line no-unused-expressions
    }

    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by id
        Actions.eventDetails({
            tripId: this.props.tripId,
            event: item,
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    _handleShare (item) {
        Actions.shareForm({ shareType: "EVENT", id: item.id, tripId: this.props.tripId });
    }

    // Take user to event creation form
    _handleCreateItem () {
        Actions.eventForm({
            tripId: this.props.tripId,
            name: "",
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    // Take user to event update form (creation w/ prefill)
    _handleUpdate (event) {
        Actions.eventForm({
            tripId: this.props.tripId,
            event: event,
            title: "Update Event",
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    renderEvents () {
        return realm.objects("Event").map((event, i) => {
            return (
                <View key={i} style={{ paddingBottom: 5 }}>
                    <Title>Name: {event.eventName}</Title>
                    <Subtitle>Start: {JSON.stringify(event.startDateTime)}</Subtitle>
                    <Caption>End: {JSON.stringify(event.endDateTime)}</Caption>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    renderOnlineView () {
        return (
            <ListMapTemplate data={this.formattedEvents()}
                emptyListMessage={
                    this.props.eventsGETStatus !== FETCH_STATUS.ATTEMPTING
                    ? "No events for the date you have selected" : ""}
                loadingData={
                    (this.props.eventsGETStatus === FETCH_STATUS.ATTEMPTING) ||
                    (this.props.eventDELETEStatus === FETCH_STATUS.ATTEMPTING)
                }
                enableSearch={true}
                onSearch={this._handleSearch}
                enableMap={true}
                onToggleMap={this._handleToggleMap}
                mapProps={{ region: this.calculateMapViewPort() }}
                mapMarkers={this.formattedEventMarkers()}
                showDelete={true}
                onDelete={this._handleDelete}
                showShare={true}
                onShare={this._handleShare}
                onRefresh={this._handleRefresh}
                onClickItem={this._handleClickItem}
                onCreateItem={this._handleCreateItem}
                showEdit={true}
                onEdit={this._handleUpdate} />
        );
    }

    renderOfflineView () {
        let events = this.renderEvents();
        return (
            <ScrollView>
                { events }
            </ScrollView>
        );
    }

    render () {
        let eventsView = null;
        if (this.state.isConnected) {
            eventsView = this.renderOnlineView();
        } else {
            eventsView = this.renderOfflineView();
        }
        return eventsView;
    }
}

export default connect((state) => {
    // Map state to props
    return {
        events: state.events.events,
        eventsGETStatus: state.events.eventsGETStatus,
        eventDELETEStatus: state.events.eventDELETEStatus,
        refresh: state.events.refresh
    };
})(EventsMapView);