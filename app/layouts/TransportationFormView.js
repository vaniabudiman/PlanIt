import React, { Component } from "react";
import { connect } from "react-redux";
import FormTemplate, { Types } from "../templates/FormTemplate.js";
import { Actions } from "react-native-router-flux";
import { createTransportation, updateTransportation } from "../actions/transportationActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { isDevMode } from "../utils/utils.js";

class TransportationFormView extends Component {
    static propTypes = {
        dispatch: React.PropTypes.func,
        transportation: React.PropTypes.object,
        tripId: React.PropTypes.number,
        tripStartDate: React.PropTypes.string,
        tripEndDate: React.PropTypes.string,
        transportationPOSTStatus: React.PropTypes.string,
        transportationPUTStatus: React.PropTypes.string
    }

    constructor (props) {
        super(props);

        this.state = {
            items: this.formattedInputs(this.props.transportation),
            loadingInputs: false,
        };

        // Bind callback handlers
        this._handleCancel = this._handleCancel.bind(this);
        this._handleSave = this._handleSave.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleInputValueChange = this._handleInputValueChange.bind(this);

        // Bind Redux action creators
        this._createTransportation =
            (transportationData) => this.props.dispatch(createTransportation(transportationData));
        this._updateTransportation =
            (transportationId, transportationData) => this.props.dispatch(updateTransportation(
                transportationId, transportationData
            ));
    }

    componentWillReceiveProps (nextProps) {
        // Pop page if transportation was successfully created/updated && previous status was attempt
        if (this.props.transportationPOSTStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.transportationPOSTStatus === FETCH_STATUS.SUCCESS) {
            alert("Transportation created successfully!");
            Actions.pop();
        }
        if (this.props.transportationPUTStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.transportationPUTStatus === FETCH_STATUS.SUCCESS) {
            alert("Transportation updated successfully!");
            Actions.pop();
        }
    }

    // Format input fields
    formattedInputs (transportation = null) {
        let inputs = [
            { id: 1, title: "Type*", value: "flight", type: Types.PICKER,
                pickerItems: ["flight", "bus", "car", "train", "sea"] },
            { id: 2, title: "Operator", value: "", type: Types.TEXT },
            { id: 3, title: "Number", value: "", type: Types.TEXT },
            { id: 4, title: "Departure Address", value: "", type: Types.TEXT },
            { id: 5, title: "Arrival Address", value: "", type: Types.TEXT },
            { id: 6, title: "Depature Date*", value: "", type: Types.DATE,
                min: this.props.tripStartDate, max: this.props.tripEndDate },
            { id: 7, title: "Departure Time*", value: "", type: Types.TIME },
            { id: 8, title: "Arrival Date*", value: "", type: Types.DATE,
                min: this.props.tripStartDate, max: this.props.tripEndDate },
            { id: 9, title: "Arrival Time*", value: "", type: Types.TIME },
            
        ];

        if (transportation) {

            // parsing start and end datetimes for individual components to pass into date/timepicker
            let startDateTime = new Date(transportation.transportation.departureDateTime + " UTC"),
                endDateTime = new Date(transportation.transportation.arrivalDateTime + " UTC");

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

            inputs[0].value = transportation.transportation.type;
            inputs[1].value = transportation.transportation.operator;
            inputs[2].value = transportation.transportation.number;
            inputs[3].value = transportation.transportation.departureAddress;
            inputs[4].value = transportation.transportation.arrivalAddress;
            inputs[5].value = startYear + "," + startMonth + "," + startDay;
            inputs[6].value = startHour + "," + startMinute;
            inputs[7].value = endYear + "," + endMonth + "," + endDay;
            inputs[8].value = endHour + "," + endMinute;
            
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


        let startDateString = this.state.items[5].value,
            startTimeString = this.state.items[6].value,
            endDateString = this.state.items[7].value,
            endTimeString = this.state.items[8].value;

        if (startDateString === "" || startTimeString === "") {
            alert("Please enter a departure date and time!");
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
            alert("Please enter an arrival date and time!");
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

        let transportationData = {
            type: this.state.items[0].value,
            operator: this.state.items[1].value,
            number: this.state.items[2].value,
            departureAddress: this.state.items[3].value,
            departureDateTime: startDateTime.toUTCString(),
            arrivalAddress: this.state.items[4].value,
            arrivalDateTime: endDateTime.toUTCString(),
            tripID: this.props.tripId
        };

        if (this.props.transportation) {
            this._updateTransportation(this.props.transportation.transportation.transportationID, transportationData);
        }
        else {
            this._createTransportation(transportationData);
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
        transportations: state.transportation.transportations,
        newTransportation: state.transportation.transportation,
        transportationPOSTStatus: state.transportation.transportationPOSTStatus,
        transportationPUTStatus: state.transportation.transportationPUTStatus
    };
})(TransportationFormView);