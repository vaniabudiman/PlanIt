import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getBookmarks, deleteBookmark } from "../actions/bookmarksActions.js";
import { getRegionForCoordinates } from "../utils/utils.js";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { isDevMode } from "../utils/utils.js";
import { NetInfo } from "react-native";
import realm from "../../Realm/realm.js";
import { ScrollView, View, Text, Divider } from "@shoutem/ui";


class BookmarksView extends Component {

    static propTypes = {
        tripId: React.PropTypes.number,
        bookmarks: React.PropTypes.array,
        bookmarksGETStatus: React.PropTypes.string,
        bookmarksDELETEStatus: React.PropTypes.string,
        dispatch: React.PropTypes.func,
        tripStartDate: React.PropTypes.string,
        tripEndDate: React.PropTypes.string,
    }

    constructor (props) {
        super(props);

        this.state = {
            bookmarks: this.props.bookmarks,
            searchString: "",
            isConnected: null,
            offlineBookmarks: null
        };

        this.requestBookmarks(this.props.dispatch, this.props.tripId);

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleShare = this._handleShare.bind(this);
        this._handleAdd = this._handleAdd.bind(this);
        this._handleToggleMap = this._handleToggleMap.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleConnectivityChange = this._handleConnectivityChange.bind(this);
        this.renderOnlineView = this.renderOnlineView.bind(this);
        this.renderOfflineView = this.renderOfflineView.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.tripId && (this.props.tripId !== nextProps.tripId)) {
            this.requestBookmarks(nextProps.dispatch, nextProps.tripId);
        }

        // Always update state bookmarks w/ latest bookmarks from props
        this.setState({ bookmarks: nextProps.bookmarks });
    }

    componentDidMount () {
        NetInfo.isConnected.addEventListener(
            "change",
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );
    }

    componentWillUnmount () {
        NetInfo.isConnected.removeEventListener(
            "change",
            this._handleConnectivityChange
        );
    }

    _handleConnectivityChange = (isConnected) => {
        this.setState({
            isConnected,
        });
    };

    requestBookmarks (dispatch, tripId) {
        dispatch(getBookmarks(tripId));
    }

    renderBookmarks () {
        return realm.objects("Bookmark").map(function (bookmark) {
            return (
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Bookmark ID: {bookmark.bookmarkID}</Text>
                    <Text>Location ID: {bookmark.locationID}</Text>
                    <Text>Name: {bookmark.name}</Text>
                    <Text>Address: {bookmark.address}</Text>
                    <Text>Type: {bookmark.type}</Text>
                    <Divider styleName="line" />
                </View>
            );
        });
    }

    formattedBookmarks () {
        return this.state.bookmarks.map((bookmark) => {
            return {
                title: bookmark.name,
                id: bookmark.bookmarkID,
                placeId: bookmark.placeID,
                subtitle: bookmark.address,
                caption: bookmark.type,
                lat: bookmark.lat.toString(),
                lon: bookmark.lon.toString()
            };
        });
    }

    formattedBookmarkMarkers () {
        return this.state.bookmarks.map((bookmark) => {
            return {
                id: bookmark.bookmarkID,
                latlng: {
                    latitude: bookmark.lat,
                    longitude: bookmark.lon
                },
                title: bookmark.name,
                description: bookmark.address
            };
        });
    }

    calculateMapViewPort () {
        if (this.state.bookmarks.length === 0) {
            return null;
        }

        return getRegionForCoordinates(this.state.bookmarks.map((bookmark) => {
            return {
                latitude: bookmark.lat,
                longitude: bookmark.lon
            };
        }));
    }

    _handleSearch (str) {
        str = str.trim().toLowerCase();

        if (str === "") {
            // empty search value, so return all current bookmarks from props
            this.setState({ bookmarks: this.props.bookmarks, searchString: str });
        } else {
            let matchedBookmarks = this.state.bookmarks.filter((bookmark) => {
                // Match on bookmark "name", address, & "types"
                return (bookmark.name.toLowerCase().indexOf(str) !== -1) ||
                    (bookmark.address.toLowerCase().indexOf(str) !== -1) ||
                    (bookmark.type.toLowerCase().indexOf(str) !== -1);
            });
            this.setState({ bookmarks: matchedBookmarks, searchString: str });
        }
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestBookmarks(this.props.dispatch, this.props.tripId);

        this.setState({ searchString: "" });
    }

    _handleDelete (item) {
        alert ("Successfully deleted Bookmark.");

        this.props.dispatch(deleteBookmark(item.id));
    }

    _handleAdd (item) {
        Actions.eventForm({
            address: item.subtitle,
            tripId: this.props.tripId,
            title: "Create Event",
            lat: item.lat.toString(),
            lon: item.lon.toString(),
            name: item.title,
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by id
        isDevMode() && alert("clicked on item: " + item.id); // eslint-disable-line no-unused-expressions

        Actions.attractionDetails({
            title: "Bookmark Details",
            tripId: this.props.tripId,
            attraction: { id: item.placeId }, // just add id for placeId in call to leverage the same view
            allowCreate: true,
            isBookmark: true,
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    _handleToggleMap (showMap) {
        isDevMode() && alert("toggled map: " + showMap); // eslint-disable-line no-unused-expressions
    }

    _handleShare (item) {   // TODO: check ListMapTemplate updated to bind entire item to onShare instead of just id
        // Make necessary calls to share the item identified by id
        alert("share: " + item.id);

        // TODO: implement in sprint 2
    }

    renderOnlineView () {
        return (
            <ListMapTemplate data={this.formattedBookmarks()}
                emptyListMessage={
                    this.props.bookmarksGETStatus !== FETCH_STATUS.ATTEMPTING
                        ? "You don't have any bookmarks for this trip yet. Start browsing and create one!" : ""}
                loadingData={
                    (this.props.bookmarksGETStatus === FETCH_STATUS.ATTEMPTING) ||
                    (this.props.bookmarksDELETEStatus === FETCH_STATUS.ATTEMPTING)
                }
                enableSearch={true}
                onSearch={this._handleSearch}
                enableMap={true}
                onToggleMap={this._handleToggleMap}
                mapProps={{ region: this.calculateMapViewPort() }}
                mapMarkers={this.formattedBookmarkMarkers()}
                onRefresh={this._handleRefresh}
                showDelete={true}
                onDelete={this._handleDelete}
                showAdd={true}
                onAdd={this._handleAdd}
                showShare={false}
                onShare={this._handleShare}
                onClickItem={this._handleClickItem} />
        );
    }

    renderOfflineView () {
        let bookmarks = this.renderBookmarks();
        return (
            <ScrollView>
                { bookmarks }
            </ScrollView>
        );
    }

    render () {
        let bookmarksView = null;
        if (this.state.isConnected) {
            bookmarksView = this.renderOnlineView();
        } else {
            bookmarksView = this.renderOfflineView();
        }
        return bookmarksView;
    }
}

export default connect((state) => {
    // map state to props
    return {
        bookmarks: state.bookmarks.bookmarks,
        bookmarksGETStatus: state.bookmarks.bookmarksGETStatus,
        bookmarksDELETEStatus: state.bookmarks.bookmarksDELETEStatus
    };
})(BookmarksView);