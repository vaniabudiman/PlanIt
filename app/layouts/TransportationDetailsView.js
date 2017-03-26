import React, { Component } from "react";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getTransportationDetails } from "../actions/transportationActions.js";
import ItemDetailsTemplate from "../templates/ItemDetailsTemplate.js";
import { Actions } from "react-native-router-flux";


class TransportationDetailsView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        tripId: React.PropTypes.number,
        transportation: React.PropTypes.object,
        details: React.PropTypes.object,
        transportationDetailsGETStatus: React.PropTypes.string,
        allowUpdate: React.PropTypes.bool,
        tripStartDate: React.PropTypes.string,
        tripEndDate: React.PropTypes.string,
    }

    static defaultProps = {
        allowUpdate: true
    }

    constructor (props) {
        super(props);

        this.requestTransportationDetails(this.props.dispatch, this.props.transportation.id);

        // Bind Redux action creators
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleUpdate = this._handleUpdate.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        // Fetch new list of details if a different transportation is requested
        if (nextProps.transportation && (this.props.transportation.id !== nextProps.transportation.id)) {
            this.requestTransportationDetails(nextProps.dispatch, nextProps.transportation.id);
        }

        // Always update state details w/ latest details from props
        this.setState({ details: nextProps.details });
    }

    requestTransportationDetails (dispatch, transportationId) {
        dispatch(getTransportationDetails(transportationId));
    }

    formattedTransportationDetails () {
        
        if (!this.props.details) {
            return [];
        }

        let startDate = new Date(this.props.details.departureDateTime + " UTC"),
            endDate = new Date(this.props.details.arrivalDateTime + " UTC");
        return [
            { id: 1, title: "Type", description: this.props.details.type },
            { id: 1, title: "Operator", description: this.props.details.operator },
            { id: 1, title: "Number", description: this.props.details.number },
            { id: 2, title: "Departure Address", description: this.props.details.departureAddress },
            { id: 3, title: "Departure", description: startDate.toString() },
            { id: 2, title: "Arrival Address", description: this.props.details.arrivalAddress },
            { id: 4, title: "Arrival", description: endDate.toString() }
        ];
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestTransportationDetails(this.props.dispatch, this.props.transportation.id);
    }

    _handleUpdate () {
        Actions.transportationForm({
            tripId: this.props.tripId,
            transportation: this.props.transportation,
            title: "Update Transportation",
            tripStartDate: this.props.tripStartDate,
            tripEndDate: this.props.tripEndDate
        });
    }

    render () {
        return (
            <ItemDetailsTemplate data={this.formattedTransportationDetails()}
                onRefresh={this._handleRefresh}
                showAdd={this.props.allowUpdate}
                addButtonText={"UPDATE TRANSPORTATION"}
                onAdd={this._handleUpdate}
                loadingData={
                    (this.props.transportationDetailsGETStatus === FETCH_STATUS.ATTEMPTING)
                } />
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        details: state.transportation.transportation,
        transportationDetailsGETStatus: state.transportation.transportationDetailsGETStatus
    };
})(TransportationDetailsView);