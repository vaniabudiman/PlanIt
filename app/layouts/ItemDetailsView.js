import React, { Component } from "react";
import ItemDetailsTemplate, { Types } from "../templates/ItemDetailsTemplate.js";
import { isDevMode } from "../utils/utils.js";


/*
 * NOTE: This is a simple demo on how to use SOME of the props the ItemDetailsTemplate has for implementing the Trips View
 *       There may be props available in the ItemDetailsTemplate that I've missed in the demo, so read through the
 *       props list in that file for the fullest complete set of props available. I've tried to document them in
 *       JSDoc style comments at the top of the file for convenience - although again some may be missed in the comments
 *       so the "propTypes" list should be the most complete... since we disallow using props not documented in this object
*/


// TODO: remove these mocks
let fields = [
    { id: 1, title: "field name", description: "field description goes here", type: Types.TEXT },
    { id: 2, title: "field name2", description: "field description2 goes here" },
    { id: 3, title: "field name3", description: "field description3 goes here" },
    { id: 4, title: "field name4", description: "field description4 goes here" },
    { id: 5, title: "field name5", description: "field description5 goes here" },
    { id: 6, title: "field name6", description: "field description6 goes here" },
    { id: 7, title: "field name7", description: "field description7 goes here" },
    { id: 8, title: "field name8", description: "field description8 goes here" },
    { id: 9, title: "field name9", description: "field description9 goes here" },
    { id: 10, title: "field name10", description: "field description10 goes here" },
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


export default class ItemDetailsView extends Component {

    constructor (props) {
        super(props);

        // TODO: remove... this is just an example
        //      - the items will probs be coming from server (or Realm) if offline
        //      - how we do the loading state may be different / vary depending on how data is loaded in from server/Realm
        this.state = {
            items: fields,
            loadingFields: false
        };

        // Bind callback handlers
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleAdd = this._handleAdd.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleEdit = this._handleEdit.bind(this);
        this._handleShare = this._handleShare.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleRefresh () {
        // Make necessary calls to fetch & fresh data from server/Realm as necessary
        isDevMode() && alert("refreshing"); // eslint-disable-line no-unused-expressions
        this.setState({ loadingTrips: true });
        setTimeout(() => this.setState({ loadingTrips: false }), 1000);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleLoadMore () {
        // Make necessary calls to fetch more data from server/Realm as necessary
        isDevMode() && alert("loading more"); // eslint-disable-line no-unused-expressions
        this.setState({ loadingTrips: true });
        setTimeout(() => this.setState({ loadingTrips: false }), 1000);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleAdd () {
        // Make necessary calls to add this view item/details.
        alert("adding");
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleDelete () {
        // Make necessary calls to delete this view item/details.
        alert("deleting");
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleEdit () {
        // Make necessary calls to get/navigate to edit this item/details.
        alert("editing");
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleShare () {
        // Make necessary calls to share this item/details.
        alert("share");
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleMap (newMapToggleState) {
        // Make necessary calls to do w/e you want based on this new map toggled state
        isDevMode() && alert("map toggled to: " + newMapToggleState); // eslint-disable-line no-unused-expressions
    }

    render () {
        return (
            <ItemDetailsTemplate data={this.state.items}
                loadingData={this.state.loadingFields}
                enableMap={true}
                mapProps={mapProps}
                onRefresh={this._handleRefresh}
                showAdd={true}
                showDelete={true}
                showEdit={true}
                showShare={true}
                onAdd={this._handleAdd}
                onDelete={this._handleDelete}
                onEdit={this._handleEdit}
                onShare={this._handleShare}
                onToggleMap={this._handleToggleMap} />
        );
    }
}