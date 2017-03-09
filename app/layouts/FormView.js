import React, { Component } from "react";
import FormTemplate, { Types } from "../templates/FormTemplate.js";
import { isDevMode } from "../utils/utils.js";


/*
 * NOTE: This is a simple demo on how to use SOME of the props the FormTemplate has for implementing the Trips View
 *       There may be props available in the FormTemplate that I've missed in the demo, so read through the
 *       props list in that file for the fullest complete set of props available. I've tried to document them in
 *       JSDoc style comments at the top of the file for convenience - although again some may be missed in the comments
 *       so the "propTypes" list should be the most complete... since we disallow using props not documented in this object
*/


// TODO: remove these mocks
let inputs = [
    { id: 1, title: "input 1", placeholder: "placeholder 1", value: "value 1", type: Types.TEXT },
    { id: 3, title: "input 3", placeholder: "placeholder 3", value: "readOnly value 3", readOnly: true },
    { id: 4, title: "input 4", placeholder: "placeholder 4", value: "readOnly value 4", readOnly: true },
    { id: 5, title: "input 5", placeholder: "placeholder 5", value: "value 5" },
    { id: 6, title: "input 5", placeholder: "placeholder 6", value: "value 6" },
    { id: 7, title: "input 5", placeholder: "placeholder 7", value: "value 7" },
    { id: 8, title: "input 5", placeholder: "placeholder 8", value: "value 8" },
    { id: 9, title: "input 5", placeholder: "placeholder 9", value: "value 9" },
    { id: 10, title: "input 5", placeholder: "placeholder 10", value: "value 10" },
];

// TODO: remove this mock OR edit it (adding necessary props from the MapView api) to suite the trips view's needs
var mapProps = {
    // TODO: for the map enabled views it will be best if we can do someting like this to get a descent default
    //       location centering & scaling (per locations... e.g. trips/bookmars/etc.)
    region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
    }
};


export default class FormView extends Component {

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
        isDevMode() && alert("refreshing");
        this.setState({ loadingTrips: true });
        setTimeout(() => this.setState({ loadingTrips: false }), 1000);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleLoadMore () {
        // Make necessary calls to fetch more data from server/Realm as necessary
        isDevMode() && alert("loading more");
        this.setState({ loadingTrips: true });
        setTimeout(() => this.setState({ loadingTrips: false }), 1000);
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
        isDevMode() && alert("map toggled to: " + newMapToggleState);
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
                mapProps={mapProps}
                onRefresh={this._handleRefresh}
                onCancel={this._handleCancel}
                onSave={this._handleSave}
                onToggleMap={this._handleToggleMap} />
        );
    }
}