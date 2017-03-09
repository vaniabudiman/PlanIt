import React, { Component } from "react";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getBookmarks } from "../actions/bookmarksActions.js";
import ListMapTemplate from "../templates/ListMapTemplate.js";


class BookmarksView extends Component {

    static propTypes = {
        tripId: React.PropTypes.number,
        bookmarks: React.PropTypes.array,
        bookmarksGETStatus: React.PropTypes.string,
        dispatch: React.PropTypes.func
    }

    constructor (props) {
        super(props);

        this.state = {
            bookmarks: this.props.bookmarks,
            searchString: ""
        };

        this.requestBookmarks(this.props.dispatch, this.props.tripId);

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleInfo = this._handleInfo.bind(this);
        this._handleShare = this._handleShare.bind(this);

        this._handleClickItem = this._handleClickItem.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.tripId && (this.props.tripId !== nextProps.tripId)) {
            this.requestBookmarks(nextProps.dispatch, nextProps.tripId);
        }

        // Always update state bookmarks w/ latest bookmarks from props
        this.setState({ bookmarks: nextProps.bookmarks });
    }

    requestBookmarks (dispatch, tripId) {
        dispatch(getBookmarks(tripId));
    }

    formattedBookmarks () {
        return this.state.bookmarks.map((bookmark) => {
            return {
                title: bookmark.name,
                id: bookmark.placeID,
                subtitle: bookmark.address,
                caption: bookmark.type
            };
        });
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

    _handleInfo (item) {    // TODO: check ListMapTemplate updated to bind entire item to onInfo instead of just id
        // Make necessary calls to get/navigate to info on item identified by id
        alert("info for: " + item && item.id);

        // TODO: go to attraction details page
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by id
        alert("clicked on item: " + item.id);

        // TODO: go to attraction details page
    }

    _handleShare (item) {   // TODO: check ListMapTemplate updated to bind entire item to onShare instead of just id
        // Make necessary calls to share the item identified by id
        alert("share: " + item && item.id);

        // TODO: implement in sprint 2
    }

    render () {
        return (
            <ListMapTemplate data={this.formattedBookmarks()}
                emptyListMessage={
                    this.props.bookmarksGETStatus !== FETCH_STATUS.ATTEMPTING
                        ? "You don't have any bookmarks for this trip yet. Start browsing and create one!" : ""}
                loadingData={this.props.bookmarksGETStatus === FETCH_STATUS.ATTEMPTING}
                enableSearch={true}
                onSearch={this._handleSearch}
                enableMap={true}
                mapProps={{}}
                onRefresh={this._handleRefresh}
                showInfo={true}
                showShare={true}
                onInfo={this._handleInfo}
                onShare={this._handleShare}
                onClickItem={this._handleClickItem} />
        );
    }
}

export default connect((state) => {
    // map state to props
    return {
        bookmarks: state.bookmarks.bookmarks,
        bookmarksGETStatus: state.bookmarks.bookmarksGETStatus
    };
})(BookmarksView);