import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { deleteEvent } from "../actions/eventsActions.js";
import { isDevMode, getRegionForCoordinates } from "../utils/utils.js";

class EventsMapView extends Component {

    static propTypes = {
        tripId: React.PropTypes.number,
        events: React.PropTypes.array,
        filteredEvents: React.PropTypes.array,
        eventsGETStatus: React.PropTypes.string,
        eventDELETEStatus: React.PropTypes.string,
        dispatch: React.PropTypes.func,
        refresh: React.PropTypes.bool,
        tripStartDate: React.PropTypes.string,
        tripEndDate: React.PropTypes.string,
    }

    constructor (props) {
        super(props);

        this.state = {
            events: this.props.filteredEvents,
            searchString: ""
        };

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleShare = this._handleShare.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleCreateItem = this._handleCreateItem.bind(this);
        this._handleUpdate = this._handleUpdate.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.eventDELETEStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.eventDELETEStatus === FETCH_STATUS.SUCCESS) {
            alert("Event deleted successfully");
        }

        // Always update state events w/ latest events from props
        this.setState({ events: nextProps.events });
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
            this.setState({ events: this.props.filteredEvents, searchString: str });
        } else {
            let matchedEvents = this.state.events.filter((event) => {
                // Match on event "name", address, & "types"
                return (event.eventName.toLowerCase().indexOf(str) !== -1);
            });
            this.setState({ events: matchedEvents, searchString: str });
        }
    }

    _handleRefresh () {
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

    render () {
        return (
            <ListMapTemplate data={this.formattedEvents()}
                emptyListMessage={
                    this.props.eventsGETStatus !== FETCH_STATUS.ATTEMPTING
                    ? "No events for the date you have selected" : ""}
                loadingData={(this.props.eventDELETEStatus === FETCH_STATUS.ATTEMPTING)}
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
}

export default connect((state) => {
    // Map state to props
    return {
        events: state.events.events,
        eventDELETEStatus: state.events.eventDELETEStatus,
        refresh: state.events.refresh
    };
})(EventsMapView);