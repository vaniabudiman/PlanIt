import React, { Component } from "react";
import { connect } from "react-redux";
import FormTemplate, { Types } from "../templates/FormTemplate.js";
import { Actions } from "react-native-router-flux";
import { createEvent } from "../actions/eventsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { isDevMode } from "../utils/utils.js";

class EventFormView extends Component {
    static propTypes = {
        dispatch: React.PropTypes.func,
        event: React.PropTypes.object,
        eventPOSTStatus: React.PropTypes.string,
        tripId: React.PropTypes.number,
        address: React.PropTypes.string,
        lat: React.PropTypes.string,
        lon: React.PropTypes.string,
        name: React.PropTypes.string
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
        //this._updateEvent = (eventId, eventData) => this.props.dispatch(updateEvent(eventId, eventData));
    }

    componentWillReceiveProps (nextProps) {
        // Fetch new list of cities if a different country's list of cities is requested
        if (nextProps.eventPOSTStatus === FETCH_STATUS.SUCCESS) {
            alert("Event created successfully!");
            Actions.pop();
        }
        if (nextProps.eventPUTStatus === FETCH_STATUS.SUCCESS) {
            alert("Event updated successfully!")
            Actions.pop();
        }
    }

    requestEvents (dispatch) {
        dispatch(getEvents(this.props.event.eventID));
    }

    // Format input fields
    formattedInputs (event = null) {
        console.log("ADDRESS: " + this.props.address);
        let inputs = [
            { id: 1, title: "Event Name", value: this.props.name || "", type: Types.TEXT },
            { id: 2, title: "Address", value: this.props.address || "", type: Types.TEXT },
            { id: 3, title: "Start Date", value: "", type: Types.DATE },
            { id: 4, title: "Start Time", value: "", type: Types.TIME },
            { id: 5, title: "End Date", value: "", type: Types.DATE },
            { id: 6, title: "End Time", value: "", type: Types.TIME },
            { id: 7, title: "Notes", value: "", type: Types.TEXTAREA }
        ];

        if (event) {
            inputs[0].value = event.eventName;
            inputs[1].value = event.startDate;
            inputs[2].value = event.endDate;
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


        let startDate = new Date(this.state.items[2].value),
            startTime = this.state.items[3].value,
            endDate = new Date(this.state.items[4].value),
            endTime = this.state.items[5].value;

        if (startDate === "" || startTime === "") {
            alert("Please enter a start date and time!");
            return;
        }

        let startParts = startTime.match(/^(\d+)\:(\d+)\:(\d+)/),
            startHour = startParts[1],
            startMinute = startParts[2],
            startSecond = startParts[3];

        if (endDate === "" && endTime === "") {
            alert("Please enter an end date and time!")
            return;
        }
        let endParts = endTime.match(/^(\d+)\:(\d+)\:(\d+)/),
            endHour = endParts[1],
            endMinute = endParts[2],
            endSecond = endParts[3];

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
            note: this.state.items[6]
        };

        if (this.props.event) {
            this._updateEvent(this.props.event.id, eventData);
        }
        else {
            this._createEvent(eventData);
        }
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleMap (newMapToggleState) {
        // Make necessary calls to do w/e you want based on this new map toggled state
        isDevMode() && alert("map toggled to: " + newMapToggleState);
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
        eventPOSTStatus: state.events.eventPOSTStatus
    };
})(EventFormView);