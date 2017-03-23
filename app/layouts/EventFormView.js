import React, { Component } from "react";
import { connect } from "react-redux";
import FormTemplate, { Types } from "../templates/FormTemplate.js";
import { Actions } from "react-native-router-flux";
import { createEvent, updateEvent } from "../actions/eventsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { isDevMode } from "../utils/utils.js";

class EventFormView extends Component {
    static propTypes = {
        dispatch: React.PropTypes.func,
        event: React.PropTypes.object,
        tripId: React.PropTypes.number,
        address: React.PropTypes.string,
        lat: React.PropTypes.string,
        lon: React.PropTypes.string,
        name: React.PropTypes.string,
        tripStartDate: React.PropTypes.string,
        tripEndDate: React.PropTypes.string,
        eventPOSTStatus: React.PropTypes.string,
        eventPUTStatus: React.PropTypes.string
    }

    constructor (props) {
        super(props);

        this.state = {
            items: this.formattedInputs(this.props.event),
            loadingInputs: false,
        };

        // Bind callback handlers
        this._handleCancel = this._handleCancel.bind(this);
        this._handleSave = this._handleSave.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleInputValueChange = this._handleInputValueChange.bind(this);

        // Bind Redux action creators
        this._createEvent = (eventData) => this.props.dispatch(createEvent(eventData));
        this._updateEvent = (eventId, eventData) => this.props.dispatch(updateEvent(eventId, eventData));
    }

    componentWillReceiveProps (nextProps) {
        // Pop page if event was successfully created/updated && previous status was attempt
        if (this.props.eventPOSTStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.eventPOSTStatus === FETCH_STATUS.SUCCESS) {
            alert("Event created successfully!");
            Actions.pop();
        }
        if (this.props.eventPUTStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.eventPUTStatus === FETCH_STATUS.SUCCESS) {
            alert("Event updated successfully!");
            Actions.pop();
        }
    }

    // Format input fields
    formattedInputs (event = null) {
        let inputs = [
            { id: 1, title: "Event Name", value: this.props.name || "", type: Types.TEXT },
            { id: 2, title: "Address", value: this.props.address || "", type: Types.TEXT },
            { id: 3, title: "Notes", value: "", type: Types.TEXTAREA },
            { id: 4, title: "Start Date", value: "", type: Types.DATE,
                min: this.props.tripStartDate, max: this.props.tripEndDate },
            { id: 5, title: "Start Time", value: "", type: Types.TIME },
            { id: 6, title: "End Date", value: "", type: Types.DATE,
                min: this.props.tripStartDate, max: this.props.tripEndDate },
            { id: 7, title: "End Time", value: "", type: Types.TIME },
            
        ];

        if (event) {

            // parsing start and end datetimes for individual components to pass into date/timepicker
            let startDateTime = new Date(event.event.startDateTime + " UTC"),
                endDateTime = new Date(event.event.endDateTime + " UTC");

            let startYear = startDateTime.getFullYear(),
                startMonth = startDateTime.getMonth(),
                startDay = startDateTime.getDate(),
                startHour = startDateTime.getHours(),
                startMinute = startDateTime.getMinutes(),
                endYear = endDateTime.getFullYear(),
                endMonth = endDateTime.getMonth(),
                endDay = endDateTime.getDate(),
                endHour = endDateTime.getHours(),
                endMinute = endDateTime.getMinutes();

            inputs[0].value = event.event.eventName;
            inputs[1].value = event.event.address;
            inputs[2].value = event.event.notes;
            inputs[3].value = startYear + "," + startMonth + "," + startDay;
            inputs[4].value = startHour + "," + startMinute;
            inputs[5].value = endYear + "," + endMonth + "," + endDay;
            inputs[6].value = endHour + "," + endMinute;
            
        }

        return inputs;
    }

    // Cancel Create/Update
    _handleCancel () {
        // go back to the last page
        Actions.pop();
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleSave () {
        // Make necessary calls to save this view item/details.
        // TODO: You will likely have to do some logic to grab all the inputs from wherever the
        //       list of input items is coming from with their new values that got set in _handleInputValueChange
        //       below and then format things correctly to pass to the action that will dispatch to the server/realm


        let startDateString = this.state.items[3].value,
            startTimeString = this.state.items[4].value,
            endDateString = this.state.items[5].value,
            endTimeString = this.state.items[6].value;

        if (startDateString === "" || startTimeString === "") {
            alert("Please enter a start date and time!");
            return;
        }

        let startDate,
            splitStartDate = startDateString.split(",");

        if (splitStartDate.length === 3) { // handles prefilled cases where value was not changed
            startDate = new Date(splitStartDate[0], splitStartDate[1], splitStartDate[2]);
        } else {
            startDate = new Date(startDateString);
        }

        let startHour, startMinute, startSecond,
            splitStartTime = startTimeString.split(",");

        if (splitStartTime.length === 2) { // handles prefilled cases where value was not changed
            startHour = splitStartTime[0];
            startMinute = splitStartTime[1];
            startSecond = 0;
        } else {
            let startParts = startTimeString.match(/^(\d+)\:(\d+)\:(\d+)/);
            startHour = startParts[1];
            startMinute = startParts[2];
            startSecond = startParts[3];
        }

        if (endDateString === "" || endTimeString === "") {
            alert("Please enter an end date and time!");
            return;
        }

        let endDate,
            splitEndDate = endDateString.split(",");

        if (splitEndDate.length === 3) { // handles prefilled cases where value was not changed
            endDate = new Date(splitEndDate[0], splitEndDate[1], splitEndDate[2]);
        } else {
            endDate = new Date(endDateString);
        }

        let endHour, endMinute, endSecond,
            splitEndTime = endTimeString.split(",");
            
        if (splitEndTime.length === 2) { // handles prefilled cases where value was not changed
            endHour = splitEndTime[0];
            endMinute = splitEndTime[1];
            endSecond = 0;
        } else {
            let endParts = endTimeString.match(/^(\d+)\:(\d+)\:(\d+)/);
            endHour = endParts[1];
            endMinute = endParts[2];
            endSecond = endParts[3];
        }

        let startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
               startHour, startMinute, startSecond),
            endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(),
               endHour, endMinute, endSecond);

        let eventData = {
            eventName: this.state.items[0].value,
            address: this.state.items[1].value,
            startDateTime: startDateTime.toUTCString(),
            endDateTime: endDateTime.toUTCString(),
            tripID: this.props.tripId,
            reminderFlag: false,
            lat: this.props.lat,
            lon: this.props.lon,
            note: this.state.items[2]
        };

        if (this.props.event) {
            this._updateEvent(this.props.event.event.eventID, eventData);
        }
        else {
            this._createEvent(eventData);
        }
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleMap (newMapToggleState) {
        // Make necessary calls to do w/e you want based on this new map toggled state
        isDevMode() && alert("map toggled to: " + newMapToggleState); // eslint-disable-line no-unused-expressions
    }

    // Updates value of input that was changed
    _handleInputValueChange (id, value) {
        let newItems = this.state.items.map((input) => {
            if (input.id === id) {
                input.value = value;
                return input;
            } else {
                return input;
            }
        });

        this.setState({ items: newItems });
    }

    render () {
        return (
            <FormTemplate data={this.state.items}
                onInputValueChange={this._handleInputValueChange}
                loadingData={this.state.loadingInputs}
                onRefresh={this._handleRefresh}
                onCancel={this._handleCancel}
                onSave={this._handleSave}
                onToggleMap={this._handleToggleMap}
                onDateSelect={this._handleInputValueChange}
                onTimeSelect={this._handleInputValueChange} />
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        events: state.events.events,
        newEvent: state.events.event,
        eventPOSTStatus: state.events.eventPOSTStatus,
        eventPUTStatus: state.events.eventPUTStatus
    };
})(EventFormView);