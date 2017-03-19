import React, { Component } from "react";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getAttractionDetails } from "../actions/attractionDetailsActions.js";
import { postAttractions } from "../actions/attractionsActions.js";
import { getTypesDisplayString, getPriceLevelString } from "../utils/utils.js";
import ItemDetailsTemplate from "../templates/ItemDetailsTemplate.js";
import { Actions } from "react-native-router-flux";


class AttractionDetailsView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        tripId: React.PropTypes.number,
        attraction: React.PropTypes.object,
        details: React.PropTypes.object,
        attractionDetailsGETStatus: React.PropTypes.string,
        attractionsPOSTStatus: React.PropTypes.string,
        allowCreate: React.PropTypes.bool,
        isBookmark: React.PropTypes.bool
    }

    static defaultProps = {
        allowCreate: true
    }

    constructor (props) {
        super(props);

        this.requestAttractionDetails(this.props.dispatch, this.props.attraction.id);

        // Bind Redux action creators
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleAdd = this._handleAdd.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        // Fetch new list of details if a different attraction is requested
        if (nextProps.attraction && (this.props.attraction.id !== nextProps.attraction.id)) {
            this.requestAttractionDetails(nextProps.dispatch, nextProps.attraction.id);
        }

        // Always update state details w/ latest details from props
        this.setState({ details: nextProps.details });
    }

    requestAttractionDetails (dispatch, placeId) {
        dispatch(getAttractionDetails(placeId));
    }

    

    formattedAttractionDetails () {
        if (!this.props.details) {
            return [];
        }

        return [
            { id: 1, title: "Name", description: this.props.details.name },
            { id: 2, title: "Address", description: this.props.details.formatted_address },
            { id: 3, title: "Phone", description: this.props.details.international_phone_number },
            { id: 4, title: "Tags", description: getTypesDisplayString(this.props.details.types) },
            { id: 5, title: "Average Rating",
                description: this.props.details.rating
                                ? this.props.details.rating.toString() + "/5"
                                : "N/A" },
            { id: 6, title: "Price Level",
                description: getPriceLevelString(this.props.details.price_level)}

            // { id: __, title: "Business website (if applicable)", description: TODO },
            // { id: __, title: "Hours of operation & current open status", description: TODO}
        ];
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestAttractionDetails(this.props.dispatch, this.props.attraction.id);
    }

    _handleAdd () {
        if (this.props.isBookmark) {
            Actions.eventForm({ 
                address: this.props.details.formatted_address || this.props.details.vicinity, 
                lat: this.props.details.geometry.location.lat.toString(),
                lon: this.props.details.geometry.location.lng.toString(),
                name: this.props.details.name,
                tripId: this.props.tripId, 
                title: "Create Event" });
        } else {
            this.props.dispatch(postAttractions(this.props.attraction, this.props.tripId));
        }
    }

    render () {
        let addText = this.props.isBookmark ? "CREATE EVENT" : "ADD BOOKMARK";
        return (
            <ItemDetailsTemplate data={this.formattedAttractionDetails()}
                onRefresh={this._handleRefresh}
                showAdd={this.props.allowCreate}
                addButtonText={addText}
                onAdd={this._handleAdd}
                loadingData={
                    (this.props.attractionDetailsGETStatus === FETCH_STATUS.ATTEMPTING) ||
                    (this.props.attractionsPOSTStatus === FETCH_STATUS.ATTEMPTING)
                } />
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        details: state.attractionDetails.details,
        attractionDetailsGETStatus: state.attractionDetails.attractionDetailsGETStatus,
        attractionsPOSTStatus: state.attractions.attractionsPOSTStatus
    };
})(AttractionDetailsView);