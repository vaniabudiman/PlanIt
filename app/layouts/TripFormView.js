import React, { Component } from "react";
import { connect } from "react-redux";
import FormTemplate, { Types } from "../templates/FormTemplate.js";
import { Actions } from "react-native-router-flux";
import { createTrip } from "../actions/tripsActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";

/*
 * NOTE: This is a simple demo on how to use SOME of the props the FormTemplate has for implementing the Trips View
 *       There may be props available in the FormTemplate that I've missed in the demo, so read through the
 *       props list in that file for the fullest complete set of props available. I've tried to document them in
 *       JSDoc style comments at the top of the file for convenience - although again some may be missed in the comments
 *       so the "propTypes" list should be the most complete... since we disallow using props not documented in this object
*/

class TripFormView extends Component {
    static propTypes = {
        dispatch: React.PropTypes.func,
        isUpdate: React.PropTypes.bool, //.isRequired,
        tripId: React.PropTypes.number,
        tripPOSTStatus: React.PropTypes.string
    }

    constructor (props) {
        super(props);

        let inputs = [
            { id: 1, title: "Trip Name", value: "", type: Types.TEXT },
            { id: 2, title: "Start Date", value: "", type: Types.DATE },
            { id: 3, title: "End Date", value: "", type: Types.DATE },
        ];

        // TODO: remove... this is just an example
        //      - the items will probs be coming from server (or Realm) if offline
        //      - how we do the loading state may be different / vary depending on how data is loaded in from server/Realm
        this.state = {
            items: inputs,
            loadingInputs: false,
        };

        // Bind callback handlers
        this._handleCancel = this._handleCancel.bind(this);
        this._handleSave = this._handleSave.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleInputValueChange = this._handleInputValueChange.bind(this);

        // Bind Redux action creators
        this._createTrip = (tripData) => this.props.dispatch(createTrip(tripData));
        //this._updateTrip = () => this.props.dispatch(updateTrip(this.state.items));
    }

    componentWillReceiveProps (nextProps) {
        // Fetch new list of cities if a different country's list of cities is requested
        if (nextProps.tripPOSTStatus === FETCH_STATUS.SUCCESS) {
            Actions.newTripHome({ tripId: nextProps.tripId });
        }
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

        let tripData = {
            tripName: this.state.items[0].value,
            startDate: new Date(this.state.items[1].value).toUTCString(),
            endDate: new Date(this.state.items[2].value).toUTCString(),
            active: false
        };

        if (this.props.isUpdate) {
            //this._updateTrip();
        }
        else {
            this._createTrip(tripData);
        }
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleMap (newMapToggleState) {
        // Make necessary calls to do w/e you want based on this new map toggled state
        alert("map toggled to: " + newMapToggleState);
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
        var title = (this.props.isUpdate) ? "Update Trip" : "Create Trip";
        return (
            <FormTemplate data={this.state.items}
                onInputValueChange={this._handleInputValueChange}
                loadingData={this.state.loadingInputs}
                onRefresh={this._handleRefresh}
                onCancel={this._handleCancel}
                onSave={this._handleSave}
                onToggleMap={this._handleToggleMap}
                onDateSelect={this._handleInputValueChange}
                title={title}
                isUpdate={this.props.isUpdate} />
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        tripId: state.trips.trip.tripID,
        tripPOSTStatus: state.trips.tripPOSTStatus
    };
})(TripFormView);