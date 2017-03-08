import React, { Component } from "react";
import FormTemplate, { Types } from "../templates/FormTemplate.js";


// TODO: remove these mocks
let inputs = [
    { id: 1, title: "Username", placeholder: "placeholder 1", value: "value 1"},
    { id: 2, title: "Password", placeholder: "placeholder 2", value: "value 2" },
    { id: 3, title: "Name", placeholder: "placeholder 3", value: "value 3" },
    { id: 4, title: "Email", placeholder: "placeholder 4", value: "value 4" },
    { id: 5, title: "Home Currency", placeholder: "placeholder 5", value: "value 5" }
];


export default class UserProfileView extends Component {

    constructor (props) {
        super(props);

        // TODO: remove... this is just an example
        //      - the items will probs be coming from server (or Realm) if offline
        //      - how we do the loading state may be different / vary depending on how data is loaded in from server/Realm
        this.state = {
            items: inputs,
            loadingInputs: false
        };

        // Bind callback handlers
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
        this._handleSave = this._handleSave.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleInputValueChange = this._handleInputValueChange.bind(this);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleRefresh () {
        // Make necessary calls to fetch & fresh data from server/Realm as necessary
        alert("refreshing");
        this.setState({ loadingProfile: true });
        setTimeout(() => this.setState({ loadingProfile: false }), 1000);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleLoadMore () {
        // Make necessary calls to fetch more data from server/Realm as necessary
        alert("loading more");
        this.setState({ loadingProfile: true });
        setTimeout(() => this.setState({ loadingProfile: false }), 1000);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleCancel () {
        // Make necessary calls to cancel this view item/details.
        alert("canceling");
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleSave () {
        // Make necessary calls to save this view item/details.
        // TODO: You will likely have to do some logic to grab all the inputs from wherever the
        //       list of input items is coming from with their new values that got set in _handleInputValueChange
        //       below and then format things correctly to pass to the action that will dispatch to the server/realm
        alert("saving");
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleMap (newMapToggleState) {
        // Make necessary calls to do w/e you want based on this new map toggled state
        alert("map toggled to: " + newMapToggleState);
    }

    // TODO: remove/edit... this is just an example of how the callback would work
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
                enableMap={true}
                onRefresh={this._handleRefresh}
                onCancel={this._handleCancel}
                onSave={this._handleSave}
                onToggleMap={this._handleToggleMap} />
        );
    }
}