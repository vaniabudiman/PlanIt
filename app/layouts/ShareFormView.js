import React, { Component } from "react";
import { connect } from "react-redux";
import FormTemplate, { Types } from "../templates/FormTemplate.js";
import { Actions } from "react-native-router-flux";
import { createShared } from "../actions/sharingActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


class ShareFormView extends Component {
    static propTypes = {
        dispatch: React.PropTypes.func,
        shareType: React.PropTypes.string,
        id: React.PropTypes.number,
        tripId: React.PropTypes.number,
        sharedPOSTStatus: React.PropTypes.string
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
        // Pop page if event was successfully created && previous status was attempt
        if (this.props.sharedPOSTStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.sharedPOSTStatus === FETCH_STATUS.SUCCESS) {
            alert("Item shared successfully!");
            Actions.pop();
        }
    }

    formattedInputs () {
        let inputs = [
            { id: 1, title: "Allow edit*", value: "no", type: Types.PICKER,
                pickerItems: ["yes", "no"] },
            { id: 2, title: "Share with (enter a comma separated list of usernames)*", value: "", type: Types.TEXT }
        ];

        return inputs;
    }

    isAllowWrite () {
        return this.state.items[0].value === "yes" ? true : false;
    }

    getUsers () {
        let users = this.state.items[1].value.split(",");
        return users.map((user) => user.trim());
    }

    _handleCancel () {
        Actions.pop();
    }

    _handleSave () {
        this.props.dispatch(
            createShared(this.props.tripId, this.isAllowWrite(), this.props.id, this.props.shareType, this.getUsers()));
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
        sharedPOSTStatus: state.sharing.sharedPOSTStatus
    };
})(ShareFormView);