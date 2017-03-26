import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getEvents, deleteEvent } from "../actions/eventsActions.js";
import { isDevMode } from "../utils/utils.js";


var enableCalendar = true;


class ItineraryListView extends Component {

    static propTypes = {
        tripId: React.PropTypes.number,
        tripStartDate: React.PropTypes.string,
        tripEndDate: React.PropTypes.string,
        events: React.PropTypes.array,
        eventsGETStatus: React.PropTypes.string,
        eventDELETEStatus: React.PropTypes.string,
        dispatch: React.PropTypes.func,
        refresh: React.PropTypes.bool
    }

    constructor (props) {
        super(props);

        this.state = {
            events: this.props.events,
            searchString: "",
            loadingItinerary: false
        };

        this.requestEvents(this.props.dispatch, this.props.tripId);

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleCreateItem = this._handleCreateItem.bind(this);
        this._handleUpdate = this._handleUpdate.bind(this);
        this._handleDateSelect = this._handleDateSelect.bind(this);
        this._handleAvailableCalendarDates = this._handleAvailableCalendarDates.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if ((nextProps.tripId && (this.props.tripId !== nextProps.tripId)) || nextProps.refresh) {
            this.requestEvents(nextProps.dispatch, nextProps.tripId);
        }

        if (this.props.eventDELETEStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.eventDELETEStatus === FETCH_STATUS.SUCCESS) {
            alert("Event deleted successfully");
        }

        // Always update state events w/ latest events from props
        this.setState({ events: nextProps.events });
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

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by id
        Actions.eventDetails({
            tripId: this.props.tripId,
            event: item,
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleCalendar (newCalendarToggleState) {
        // Make necessary calls to do w/e you want based on this new calendar toggled state
        isDevMode() && alert("calendar toggled to: " + newCalendarToggleState); // eslint-disable-line no-unused-expressions
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
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate,
            title: "Update Event"
        });
    }

    _handleDateSelect (date) {
        this.filterEventsByDate(date);
    }

    _handleAvailableCalendarDates () {
        // Available calendar dates will be based on the time range of the trip
        let calendarProps = { startDate: this.props.tripStartDate, endDate: this.props.tripEndDate };
        return calendarProps;
    }

    filterEventsByDate (date) {
        let filteredEvents = this.props.events.filter((event) => {
            return new Date(event.startDateTime + " UTC").toDateString() === date.toDateString();
        });
        this.goToSingleEventView(date, filteredEvents);
    }

    goToSingleEventView (date, events) {
        Actions.eventsMap({
            title: date.toDateString(),
            tripId: this.props.tripId,
            filteredEvents: events,
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    render () {
        return (
            <ListMapTemplate data={this.formattedEvents()}
                emptyListMessage={"Create an event to begin!"}
                loadingData={
                    (this.props.eventsGETStatus === FETCH_STATUS.ATTEMPTING) ||
                    (this.props.eventDELETEStatus === FETCH_STATUS.ATTEMPTING)
                }
                enableSearch={true}
                onSearch={this._handleSearch}
                enableCalendar={enableCalendar}
                calendarProps={this._handleAvailableCalendarDates()}
                onDateSelect={this._handleDateSelect}
                showCalendar={false}
                showDelete={true}
                onDelete={this._handleDelete}
                onRefresh={this._handleRefresh}
                onToggleCalendar={this._handleToggleCalendar}
                onClickItem={this._handleClickItem}
                onCreateItem={this._handleCreateItem}
                showEdit={true}
                onEdit={this._handleUpdate} />
        );
    }
}

export default connect((state) => {
    // map state to props
    return {
        events: state.events.events,
        eventsGETStatus: state.events.eventsGETStatus,
        eventDELETEStatus: state.events.eventDELETEStatus,
        refresh: state.events.refresh
    };
})(ItineraryListView);