import React, { Component } from "react";
import ListMapTemplate from "../templates/ListMapTemplate.js";


// TODO: remove these mocks
let items = [{ id: "1", title: "event1", description: "description to event1" },
            { id: "2", title: "event2", description: "description to event2" },
            { id: "3", title: "event3", description: "description to event2" }];



// TODO: remove this mock OR edit it (adding necessary props from the MapView api) to suite the events view's needs
var mapProps = {
    // TODO: for the map enabled views it will be best if we can do someting like this to get a descent default
    //       location centering & scaling (per locations... e.g. events/bookmars/etc.)
    region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
    }
};


export default class EventsView extends Component {

    static propTypes = {
        tripId: React.PropTypes.number
    }

    constructor (props) {
        super(props);

        // TODO: remove... this is just an example
        //      - the items will probs be coming from server (or Realm) if offline
        //      - how we do the loading state may be different / vary depending on how data is loaded in from server/Realm
        this.state = {
            items: items,   // TODO: change this to an empty list to see an example of the empty message
            loadingevents: false
        };

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleAdd = this._handleAdd.bind(this);
        this._handleInfo = this._handleInfo.bind(this);
        this._handleShare = this._handleShare.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleCreateItem = this._handleCreateItem.bind(this);
    }

    componentDidMount () {
        // TODO: remove this... just testing for now
        alert("events for trip id: " + this.props.tripId);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleSearch (str) {
        let newItems = items.filter(function (item) {
            return item.title.toLowerCase().indexOf(str.toLowerCase()) !== -1;
        });

        this.setState({ items: newItems });
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleRefresh () {
        // Make necessary calls to fetch & fresh data from server/Realm as necessary
        alert("refreshing");
        this.setState({ loadingevents: true });
        setTimeout(() => this.setState({ loadingevents: false }), 1000);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleLoadMore () {
        // Make necessary calls to fetch more data from server/Realm as necessary
        alert("loading more");
        this.setState({ loadingevents: true });
        setTimeout(() => this.setState({ loadingevents: false }), 1000);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleAdd (id) {
        // Make necessary calls to add the item identified by id
        alert("adding: " + id);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleInfo (id) {
        // Make necessary calls to get/navigate to info on item identified by id
        alert("info for: " + id);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleShare (id) {
        // Make necessary calls to share the item identified by id
        alert("share: " + id);
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by id
        alert("clicked on item: " + item.id);
    }

     // TODO: remove/edit... this is just an example on how the callback would work
    _handleCreateItem () {
        // Make necessary calls to navigate to item creation screen
        alert("create an item");
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleToggleMap (newMapToggleState) {
        // Make necessary calls to do w/e you want based on this new map toggled state
        alert("map toggled to: " + newMapToggleState);
    }

    render () {
        return (
            <ListMapTemplate data={this.state.items}
                emptyListMessage={"Create a event to begin!"}
                loadingData={this.state.loadingevents}
                enableSearch={true}
                onSearch={this._handleSearch}
                enableMap={true}
                mapProps={mapProps}
                onRefresh={this._handleRefresh}
                showAdd={true}
                showInfo={true}
                showShare={true}
                onAdd={this._handleAdd}
                onInfo={this._handleInfo}
                onShare={this._handleShare}
                onToggleMap={this._handleToggleMap}
                onClickItem={this._handleClickItem}
                onCreateItem={this._handleCreateItem} />
        );
    }
}