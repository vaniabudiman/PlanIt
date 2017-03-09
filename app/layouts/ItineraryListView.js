import React, { Component } from "react";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { connect } from "react-redux";
import { getEvents } from "../actions/eventsActions.js";


// TODO: remove this mock
var calendarProps = {
    startDate: "April 1, 2017 00:00:00",
    endDate: "April 7, 2017 00:00:00"
};

var enableCalendar = true;
var showCalendar = true;


class ItineraryListView extends Component {

    static propTypes = {
        tripId: React.PropTypes.number,
        events: React.PropTypes.array,
        eventsGETStatus: React.PropTypes.string,
        dispatch: React.PropTypes.func
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
        this._handleClickItem = this._handleClickItem.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.tripId && (this.props.tripId !== nextProps.tripId)) {
            this.requestBookmarks(nextProps.dispatch, nextProps.tripId);
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
                subtitle: "Begins: " + event.startDateTime,
                caption: "Ends: " + event.endDateTime
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
        this.requestBookmarks(this.props.dispatch, this.props.tripId);

        this.setState({ searchString: "" });
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by id
        alert("clicked on item: " + item.title);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleCalendar (newCalendarToggleState) {
        // Make necessary calls to do w/e you want based on this new calendar toggled state
        alert("calendar toggled to: " + newCalendarToggleState);
    }

    render () {
        return (
            <ListMapTemplate data={this.formattedEvents()}
                emptyListMessage={"Create a event to begin!"}
                loadingData={this.state.loadingItinerary}
                enableSearch={true}
                onSearch={this._handleSearch}
                enableCalendar={enableCalendar}
                calendarProps={calendarProps}
                showCalendar={showCalendar}
                onRefresh={this._handleRefresh}
                onToggleCalendar={this._handleToggleCalendar}
                onClickItem={this._handleClickItem} />
        );
    }
}

export default connect((state) => {
    // map state to props
    return {
        events: state.events.events,
        eventsGETStatus: state.events.eventsGETStatus
    };
})(ItineraryListView);