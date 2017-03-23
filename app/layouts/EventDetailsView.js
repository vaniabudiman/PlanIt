import React, { Component } from "react";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getEventDetails } from "../actions/eventsActions.js";
import ItemDetailsTemplate from "../templates/ItemDetailsTemplate.js";
import { Actions } from "react-native-router-flux";


class EventDetailsView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        tripId: React.PropTypes.number,
        event: React.PropTypes.object,
        details: React.PropTypes.object,
        eventDetailsGETStatus: React.PropTypes.string,
        allowUpdate: React.PropTypes.bool,
        tripStartDate: React.PropTypes.string,
        tripEndDate: React.PropTypes.string,
    }

    static defaultProps = {
        allowUpdate: true
    }

    constructor (props) {
        super(props);

        this.requestEventDetails(this.props.dispatch, this.props.event.id);

        // Bind Redux action creators
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleUpdate = this._handleUpdate.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        // Fetch new list of details if a different event is requested
        if (nextProps.event && (this.props.event.id !== nextProps.event.id)) {
            this.requestEventDetails(nextProps.dispatch, nextProps.event.id);
        }

        // Always update state details w/ latest details from props
        this.setState({ details: nextProps.details });
    }

    requestEventDetails (dispatch, eventId) {
        dispatch(getEventDetails(eventId));
    }

    formattedEventDetails () {
        
        if (!this.props.details) {
            return [];
        }

        let startDate = new Date(this.props.details.startDateTime + " UTC"),
            endDate = new Date(this.props.details.endDateTime + " UTC");
        return [
            { id: 1, title: "Name", description: this.props.details.eventName },
            { id: 2, title: "Address", description: this.props.details.address },
            { id: 3, title: "Start", description: startDate.toString() },
            { id: 4, title: "End", description: endDate.toString() },
            { id: 5, title: "Notes", description: this.props.details.note }
        ];
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestEventDetails(this.props.dispatch, this.props.event.id);
    }

    _handleUpdate () {
        let lat = (this.props.details.lat) ? this.props.details.lat.toString() : "",
            lon = (this.props.details.lon) ? this.props.details.lon.toString() : "";

        Actions.eventForm({
            address: this.props.details.address,
            lat: lat,
            lon: lon,
            name: this.props.details.eventName,
            tripId: this.props.tripId,
            event: this.props.event,
            title: "Update Event",
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    render () {
        return (
            <ItemDetailsTemplate data={this.formattedEventDetails()}
                onRefresh={this._handleRefresh}
                showAdd={this.props.allowUpdate}
                addButtonText={"UPDATE EVENT"}
                onAdd={this._handleUpdate}
                loadingData={
                    (this.props.eventDetailsGETStatus === FETCH_STATUS.ATTEMPTING)
                } />
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        details: state.events.event,
        eventDetailsGETStatus: state.events.eventDetailsGETStatus
    };
})(EventDetailsView);