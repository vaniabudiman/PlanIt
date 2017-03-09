import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { getCities } from "../actions/citiesActions.js";
import ListMapTemplate from "../templates/ListMapTemplate.js";


class CitiesView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        countryId: React.PropTypes.string,
        cities: React.PropTypes.array,
        citiesGETStatus: React.PropTypes.string,
        tripId: React.PropTypes.number,
    }

    constructor (props) {
        super(props);

        this.state = {
            cities: this.props.cities,
            searchString: ""
        };

        this.requestCities(this.props.dispatch, this.props.countryId);

        // Bind Redux action creators
        this._handleClickItem = this._handleClickItem.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._handleSearch = this._handleSearch.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        // Fetch new list of cities if a different country's list of cities is requested
        if (nextProps.countryId && (this.props.countryId !== nextProps.countryId)) {
            this.requestCities(nextProps.dispatch, nextProps.countryId);
        }

        // Always update state cities w/ latest cities from props
        this.setState({ cities: nextProps.cities });
    }

    requestCities (dispatch, countryId) {
        dispatch(getCities(countryId));
    }

    formattedCities () {
        return this.state.cities.map((city) => {
            return {
                title: city.name,
                id: city.geonameId,
                subtitle: city.adminName1 ? city.adminName1 + ", " + city.countryName : city.countryName,
                lat: city.lat,
                lon: city.lng
            };
        });
    }

    _handleSearch (str) {
        str = str.trim().toLowerCase();

        if (str === "") {
            // empty search value, so return all current cities from props
            this.setState({ cities: this.props.cities, searchString: str });
        } else {
            let matchedCities = this.props.cities.filter((city) => {
                // Match on city "name" or "adminName1" fields
                return (city.name.toLowerCase().indexOf(str) !== -1) ||
                    (city.adminName1.toLowerCase().indexOf(str) !== -1);
            });
            this.setState({ cities: matchedCities, searchString: str });
        }
    }

    _handleRefresh () {
        // Just fire off another fetch to refresh
        this.requestCities(this.props.dispatch, this.props.countryId);

        this.setState({ searchString: "" });
    }

    _handleClickItem (item) {
        alert("clicked on cities: " + item.title); //  TODO: remove this later

        Actions.attractions({ city: item, tripId: this.props.tripId });
    }

    render () {
        return (
            <ListMapTemplate data={this.formattedCities()}
                onClickItem={this._handleClickItem}
                onRefresh={this._handleRefresh}
                enableSearch={true}
                searchString={this.state.searchString}
                onSearch={this._handleSearch}
                loadingData={this.props.citiesGETStatus === FETCH_STATUS.ATTEMPTING } />
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        cities: state.cities.cities,
        citiesGETStatus: state.cities.citiesGETStatus
    };
})(CitiesView);