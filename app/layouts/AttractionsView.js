import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getAttractions, clearAttractionsPageToken } from "../actions/attractionsActions.js";
import ListMapTemplate from "../templates/ListMapTemplate.js";


class AttractionsView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        city: React.PropTypes.object,
        attractions: React.PropTypes.array,
        attractionsGETStatus: React.PropTypes.string,
        nextPageToken: React.PropTypes.string
    }

    constructor (props) {
        super(props);

        this.state = {
            attractions: this.props.attractions,
            searchString: ""
        };

        this.requestAttractions(this.props.dispatch, this.props.city, this.props.nextPageToken);

        // Bind Redux action creators
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleLoadMore = this._handleLoadMore.bind(this);
        this._handleSearch = this._handleSearch.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        // Fetch new list of attractions if a different city's list of attractions is requested
        if (!this.props.city || nextProps.city && (this.props.city.id !== nextProps.city.id)) {
            this.requestAttractions(nextProps.dispatch, nextProps.city, "");
        }

        // Always update state attractions w/ latest attractions from props
        this.setState({ attractions: nextProps.attractions });
    }

    requestAttractions (dispatch, city, nextPageToken, query) {
        if (nextPageToken === "") {
            this.props.dispatch(clearAttractionsPageToken());
        }
        dispatch(getAttractions(city, nextPageToken, query));
    }

    getTypesDisplayString (types) {
        // Reformat google's types (https://developers.google.com/places/web-service/supported_types)
        // into string suitable for displaying
        return types.map((type) => type.replace(/_/g, " ")).join(", ");
    }

    formattedAttractions () {
        return this.state.attractions.map((attraction) => {
            return {
                id: attraction.place_id,
                title: attraction.name,
                subtitle: attraction.vicinity || attraction.formatted_address, // nearby vs. text search
                caption: this.getTypesDisplayString(attraction.types),
                lat: attraction.location ? attraction.location.lat : null,
                lon: attraction.location ? attraction.location.lon : null,
                icon: attraction.icon
            };
        });
    }

    _handleSearch (str) {
        str = str.trim().toLowerCase();

        if (str === "") {
            this.requestAttractions(this.props.dispatch, this.props.city, "");
            this.setState({ searchString: str });
        } else {
            this.requestAttractions(this.props.dispatch, this.props.city, "", str);
            // TODO: update to fire off a textSearch get refinedAttractions
            this.setState({ searchString: str });
        }
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestAttractions(this.props.dispatch, this.props.city, "");
        this.setState({ searchString: "" });
    }

    _handleLoadMore () {
        this.requestAttractions(this.props.dispatch,
            this.props.city, this.props.nextPageToken, this.state.searchString);
    }

    _handleClickItem (item) {
        alert("clicked on attractions: " + item.name); //  TODO: remove this later

        Actions.attractionDetails({ attraction: item });
    }

    render () {
        return (
            <ListMapTemplate data={this.formattedAttractions()}
                onClickItem={this._handleClickItem}
                onRefresh={this._handleRefresh}
                onLoadMore={this._handleLoadMore}
                enableSearch={true}
                searchString={this.state.searchString}
                onSearch={this._handleSearch}
                loadingData={this.props.attractionsGETStatus === FETCH_STATUS.ATTEMPTING } />
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        attractions: state.attractions.attractions,
        attractionsGETStatus: state.attractions.attractionsGETStatus,
        nextPageToken: state.attractions.nextPageToken
    };
})(AttractionsView);