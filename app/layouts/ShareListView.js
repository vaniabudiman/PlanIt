import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { getShared, deleteShared } from "../actions/sharingActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";


class ShareListView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        count: React.PropTypes.number,
        sharedEvents: React.PropTypes.array,
        sharedBookmarks: React.PropTypes.array,
        sharedGETStatus: React.PropTypes.string,
        sharedDELETEStatus: React.PropTypes.string,
        refresh: React.PropTypes.bool
    }

    constructor (props) {
        super(props);

        this.requestShared(this.props.dispatch);

        // Bind callback handlers
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleAddItem = this._handleAddItem.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.refresh) {
            this.requestShared(nextProps.dispatch);
        }

        if (this.props.sharedDELETEStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.sharedDELETEStatus === FETCH_STATUS.SUCCESS) {
            alert("Sharing request deleted successfully!");
        }
    }

    requestShared (dispatch) {
        dispatch(getShared());
    }

    formattedEvents () {
        return this.props.sharedEvents.map((event) => {
            return {
                title: "EVENT - " +event.eventName,
                id: event.eventID,
                reminderFlag: event.reminderFlag,
                subtitle: "Begins: " + new Date(event.startDateTime + " UTC"),  // datetimes stored as UTC in DB - need to convert to local
                caption: "Ends: " + new Date(event.endDateTime + " UTC"),
                event: event,
                type: "EVENT"
            };
        });
    }

    formattedBookmarks () {
        return this.props.sharedBookmarks.map((bookmark) => {
            return {
                title: "BOOKMARK - " + bookmark.name,
                id: bookmark.bookmarkID,
                placeId: bookmark.placeID,
                subtitle: bookmark.address,
                caption: bookmark.type,
                lat: bookmark.lat.toString(),
                lon: bookmark.lon.toString(),
                type: "BOOKMARK"
            };
        });
    }

    formattedData () {
        let data = [];

        return data.concat(this.formattedEvents()).concat(this.formattedBookmarks());
    }

    gotoAttractionDetails (attraction) {
        Actions.attractionDetails({
            title: "Bookmark Details",
            attraction: { id: attraction.placeId }, // just add id for placeId in call to leverage the same view
            allowCreate: false
        });
    }

    gotoEventDetails (event) {
        Actions.eventDetails({
            event: event,
            allowUpdate: false
        });
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestShared(this.props.dispatch);
    }

    _handleDelete (item) {
        this.props.dispatch(deleteShared(item));
    }

    _handleClickItem (item) {
        switch (item.type) {
            case "EVENT":
                this.gotoEventDetails(item);
                break;
            case "BOOKMARK":
                this.gotoAttractionDetails(item);
                break;
        }
    }

    _handleAddItem (item) {
        Actions.shareToForm({ shareType: item.type, id: item.id });
    }

    render () {
        return (
            <ListMapTemplate data={this.formattedData()}
                emptyListMessage={
                    (this.props.sharedGETStatus === FETCH_STATUS.SUCCESS) && (this.props.count === 0)
                        ? "You have no pending share requests."
                        : ""
                }
                loadingData={this.props.sharedGETStatus === FETCH_STATUS.ATTEMPTING}
                enableSearch={false}
                onRefresh={this._handleRefresh}
                showDelete={true}
                onDelete={this._handleDelete}
                onClickItem={this._handleClickItem}
                showAdd={true}
                onAdd={this._handleAddItem} />
        );
    }
}

export default connect((state) => {
    return {
        count: state.sharing.count,
        sharedEvents: state.sharing.sharedEvents,
        sharedBookmarks: state.sharing.sharedBookmarks,
        sharedGETStatus: state.sharing.sharedGETStatus,
        refresh: state.sharing.refresh
    };
})(ShareListView);