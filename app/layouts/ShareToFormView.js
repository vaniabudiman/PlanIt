import React, { Component } from "react";
import { connect } from "react-redux";
import FormTemplate, { Types } from "../templates/FormTemplate.js";
import { Actions } from "react-native-router-flux";
import { updateShared } from "../actions/sharingActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


class ShareToFormView extends Component {
    static propTypes = {
        dispatch: React.PropTypes.func,
        trips: React.PropTypes.array,
        shareType: React.PropTypes.string,
        id: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.number ]),
        sharedPUTStatus: React.PropTypes.string
    }

    constructor (props) {
        super(props);

        this.state = {
            items: this.formattedInputs()
        };

        // Bind callback handlers
        this._handleCancel = this._handleCancel.bind(this);
        this._handleSave = this._handleSave.bind(this);
        this._handleInputValueChange = this._handleInputValueChange.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        // Pop page if event was successfully updated && previous status was attempt
        if (this.props.sharedPUTStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.sharedPUTStatus === FETCH_STATUS.SUCCESS) {
            alert("Item added to trip successfully!");
            Actions.pop();
        }
    }

    getPickerTrips () {
        return this.props.trips.map((trip) => {
            return { label: trip.tripName, value: trip.tripID };
        });
    }

    formattedInputs () {
        let inputs = [
            { id: 1, title: "Select a trip to add this shared item to*", value: this.props.trips[0].tripID,
                type: Types.PICKER, pickerItems: this.getPickerTrips() }
        ];

        return inputs;
    }

    _handleCancel () {
        Actions.pop();
    }

    _handleSave () {
        this.props.dispatch(updateShared(this.props.id, this.props.shareType, this.state.items[0].value));
    }

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
                onCancel={this._handleCancel}
                onSave={this._handleSave} />
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        trips: state.trips.trips,
        sharedPUTStatus: state.sharing.sharedPUTStatus
    };
})(ShareToFormView);