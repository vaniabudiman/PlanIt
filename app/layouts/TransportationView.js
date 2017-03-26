import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getTransportation, deleteTransportation } from "../actions/transportationActions.js";

class TransportationView extends Component {

    static propTypes = {
        tripId: React.PropTypes.number,
        tripStartDate: React.PropTypes.string,
        tripEndDate: React.PropTypes.string,
        transportation: React.PropTypes.array,
        transportationGETStatus: React.PropTypes.string,
        transportationDELETEStatus: React.PropTypes.string,
        dispatch: React.PropTypes.func,
        refresh: React.PropTypes.bool
    }

    constructor (props) {
        super(props);

        this.state = {
            transportation: this.props.transportation,
            searchString: "",
            loadingTransportation: false
        };

        this.requestTransportation(this.props.dispatch, this.props.tripId);

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleCreateItem = this._handleCreateItem.bind(this);
        this._handleUpdate = this._handleUpdate.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if ((nextProps.tripId && (this.props.tripId !== nextProps.tripId)) || nextProps.refresh) {
            this.requestTransportation(nextProps.dispatch, nextProps.tripId);
        }

        if (this.props.transportationDELETEStatus === FETCH_STATUS.ATTEMPTING &&
            nextProps.transportationDELETEStatus === FETCH_STATUS.SUCCESS) {
            alert("Transportation deleted successfully");
        }

        // Always update state events w/ latest events from props
        this.setState({ transportation: nextProps.transportation });
    }

    requestTransportation (dispatch, tripId) {
        dispatch(getTransportation(tripId));
    }

    formattedTransportation () {
        return this.state.transportation.map((transport) => {
            let transportTitle = (transport.operator || transport.number)
                ? transport.type + ": " + transport.operator + " " + transport.number : transport.type;
            return {
                title: transportTitle,
                id: transport.transportationID,
                subtitle: "Begins: " + new Date(transport.departureDateTime + " UTC"),  // datetimes stored as UTC in DB - need to convert to local
                caption: "Ends: " + new Date(transport.arrivalDateTime + " UTC"),
                transportation: transport
            };
        });
    }

    _handleSearch (str) {
        str = str.trim().toLowerCase();

        if (str === "") {
            // empty search value, so return all current events from props
            this.setState({ transportation: this.props.transportation, searchString: str });
        } else {
            let matchedTransportation = this.state.transportation.filter((transport) => {
                // Match on event "name", address, & "types"
                return (transport.type.toLowerCase().indexOf(str) !== -1);
            });
            this.setState({ transportation: matchedTransportation, searchString: str });
        }
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestTransportation(this.props.dispatch, this.props.tripId);

        this.setState({ searchString: "" });
    }

    _handleDelete (item) {
        this.props.dispatch(deleteTransportation(item.id));
    }

    // TODO: remove/edit... this is just an example on how the callback would work
    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by id
        Actions.transportationDetails({
            tripId: this.props.tripId,
            transportation: item,
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate,
            title: "Transportation Details"
        });
    }

    // Take user to event creation form
    _handleCreateItem () {
        Actions.transportationForm({
            tripId: this.props.tripId,
            name: "",
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    // Take user to event update form (creation w/ prefill)
    _handleUpdate (transportation) {
        Actions.transportationForm({
            tripId: this.props.tripId,
            transportation: transportation,
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate,
            title: "Update Transportation"
        });
    }

    render () {
        return (
            <ListMapTemplate data={this.formattedTransportation()}
                emptyListMessage={"Create transportation to begin!"}
                loadingData={
                    (this.props.transportationGETStatus === FETCH_STATUS.ATTEMPTING) ||
                    (this.props.transportationDELETEStatus === FETCH_STATUS.ATTEMPTING)
                }
                enableSearch={true}
                onSearch={this._handleSearch}
                showDelete={true}
                onDelete={this._handleDelete}
                onRefresh={this._handleRefresh}
                onClickItem={this._handleClickItem}
                onCreateItem={this._handleCreateItem}
                showEdit={true}
                onEdit={this._handleUpdate} />
        );
    }
}

export default connect((state) => {
    // map state to props
    return {
        transportation: state.transportation.transportations,
        transportationGETStatus: state.transportation.transportationGETStatus,
        transportationDELETEStatus: state.transportation.transportationDELETEStatus,
        refresh: state.transportation.refresh
    };
})(TransportationView);