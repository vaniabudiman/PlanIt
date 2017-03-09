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
        if (nextProps.putUserStatus !== FETCH_STATUS.ATTEMPTING &&
            (nextProps.getUserStatus === FETCH_STATUS.SUCCESS || nextProps.putUserStatus === FETCH_STATUS.SUCCESS)) {
            this.setState({ userData: nextProps.userData });
            // The JSON unparse and parse is to create a copy of nextProps.userData instead of passing by reference.
            // Otherwise originalUserData will get updated whenever userData is updated.
            this.setState({ originalUserData: JSON.parse(JSON.stringify(nextProps.userData)) });
        }
    }

    _handleRefresh () {
        this.props.dispatch(getUser());
    }

    _handleCancel () {
        this.setState({ userData: JSON.parse(JSON.stringify(this.state.originalUserData)) });
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleSave () {
        let password = this.state.userData[1].value;
        let name = this.state.userData[2].value;
        let email = this.state.userData[3].value;
        let homeCurrency = this.state.userData[4].value;
        let userData = {
            userName: this.state.userData[0].value,
            password: password !== this.state.originalUserData[1].value ? password : null,
            name: name !== this.state.originalUserData[2].value ? name : null,
            email: email !== this.state.originalUserData[3].value ? email : null,
            homeCurrency: homeCurrency !== this.state.originalUserData[4].value ? homeCurrency : null,
        };
        this.props.dispatch(putUser(userData));
    }


    _handleInputValueChange (id, value) {
        this.setState({ userData: this.state.userData.map((input) => {
            if (input.id === id) {
                input.value = value;
                return input;
            } else {
                return input;
            }
        }) });
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