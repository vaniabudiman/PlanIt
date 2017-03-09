import React, { Component } from "react";
import FormTemplate from "../templates/FormTemplate.js";
import { getUser, putUser } from "../actions/accountActions.js";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


class UserProfileView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        userData: React.PropTypes.array,
        getUserStatus: React.PropTypes.string,
        putUserStatus: React.PropTypes.string,
    }

    constructor (props) {
        super(props);

        this.state = {
            loadingInputs: false,
            userData: [],
            originalUserData: [],
        };

        this.props.dispatch(getUser());

        // Bind callback handlers
        this._handleLoadUser = this._handleLoadUser.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
        this._handleSave = this._handleSave.bind(this);
        this._handleInputValueChange = this._handleInputValueChange.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        // Fetch new list of cities if a different country's list of cities is requested
        if (nextProps.getUserStatus === FETCH_STATUS.SUCCESS ||
            nextProps.putUserStatus === FETCH_STATUS.SUCCESS) {
            this.setState({ userData: nextProps.userData });
            this.setState({ originalUserData: nextProps.userData });
        }
    }

    _handleRefresh () {
        this.props.dispatch(getUser());
    }

    _handleCancel () {
        // alert("canceling");
        // TODO: maybe use originalUserData to revert back ...
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleSave () {
        // Make necessary calls to save this view item/details.
        // TODO: You will likely have to do some logic to grab all the inputs from wherever the
        //       list of input items is coming from with their new values that got set in _handleInputValueChange
        //       below and then format things correctly to pass to the action that will dispatch to the server/realm
        let userData = {
            userName: this.state.userData[0].value,
            password: this.state.userData[1].value,
            name: this.state.userData[2].value,
            email: this.state.userData[3].value,
            homeCurrency: this.state.userData[4].value,
        };
        this.props.dispatch(putUser(userData));
    }


    _handleInputValueChange (id, value) {
        let newItems = this.state.userData.map((input) => {
            if (input.id === id) {
                input.value = value;
                return input;
            } else {
                return input;
            }
        });
        this.setState({ userData: newItems });
    }

    _handleLoadUser () {
        this.props.dispatch(getUser());
    }

    render () {
        return (
            <FormTemplate data={this.state.userData}
                onInputValueChange={this._handleInputValueChange}
                onRefresh={this._handleRefresh}
                onCancel={this._handleCancel}
                onSave={this._handleSave}
                loadingData={this.props.getUserStatus === FETCH_STATUS.ATTEMPTING } />
        );
    }
}

export default connect((state) => {
    return {
        userData: state.account.userData,
        getUserStatus: state.account.getUserStatus,
        putUserStatus: state.account.putUserStatus,
    };
})(UserProfileView);