import React, { Component } from "react";
import { connect } from "react-redux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getAttractionDetails } from "../actions/attractionDetailsActions.js";
import { getTypesDisplayString } from "../utils/utils.js";
import ItemDetailsTemplate from "../templates/ItemDetailsTemplate.js";


class AttractionDetailsView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        attraction: React.PropTypes.object,
        details: React.PropTypes.object,
        attractionDetailsGETStatus: React.PropTypes.string
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
            { id: 1, title: "Attraction name", description: this.props.details.name },
            { id: 2, title: "Location address", description: this.props.details.formatted_address },
            { id: 3, title: "Contact #", description: this.props.details.international_phone_number },
            { id: 4, title: "Tags/Categories", description: getTypesDisplayString(this.props.details.types) },
            { id: 5, title: "Average user rating", description: this.props.details.rating.toString() },
            { id: 6, title: "Costliness on a scale of 0 (free) to 4 (very expensive)",
                description: this.props.details.price_level ? this.props.details.price_level : "Unavailable" }

            // { id: __, title: "Business website (if applicable)", description: TODO },
            // { id: __, title: "Hours of operation & current open status", description: TODO}
        ];
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestAttractionDetails(this.props.dispatch, this.props.attraction.id);
    }

    _handleAdd () {
        // TODO: dispatch correct action to add this attraction (item) to bookmarks
        alert("add this as a bookmark for this trip: " + this.props.details.name);
    }

    render () {
        return (
            <ItemDetailsTemplate data={this.formattedAttractionDetails()}
                onRefresh={this._handleRefresh}
                showAdd={true}
                onAdd={this._handleAdd}
                loadingData={this.props.attractionDetailsGETStatus === FETCH_STATUS.ATTEMPTING} />
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        details: state.attractionDetails.details,
        attractionDetailsGETStatus: state.attractionDetails.attractionDetailsGETStatus
    };
})(AttractionDetailsView);