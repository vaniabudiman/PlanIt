import React, { Component } from "react";
import Countries from "../data/countries.json";
import { extend } from "underscore";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { Actions } from "react-native-router-flux";


export default class CountriesView extends Component {

    static propTypes = {
        continentId: React.PropTypes.string,
        tripId: React.PropTypes.number,
    }

    constructor (props) {
        super(props);

        let continentCountries = this.getCountries(this.props.continentId);

        this.state = {
            countries: continentCountries,
            matchedCountries: continentCountries,
            searchString: ""
        };

        // Bind callback handlers
        this._handleSearch = this._handleSearch.bind(this);
        this._handleClickItem = this._handleClickItem.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.continentId !== nextProps.continentId) {
            let continentCountries = this.getCountries(nextProps.continentId);

            this.setState({
                countries: continentCountries,
                matchedCountries: continentCountries
            });
        }
    }

    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by name
        Actions.cities({ countryId: item.id, tripId: this.props.tripId });

    }

    _handleSearch (str) {
        str = str.trim().toLowerCase();

        if (str === "") {
            this.setState({ matchedCountries: this.state.countries, searchString: "" });
        } else {
            let matchedCountries = this.state.countries.filter((country) => {
                return country.title.toLowerCase().indexOf(str) !== -1;
            });
            this.setState({ matchedCountries: matchedCountries, searchString: str });
        }
    }

    getCountries (continentId) {
        const countriesFilteredByContinent = [];

        for (var key in Countries.countries) {
            let country = Countries.countries[key];
            if (country.continent === continentId) {
                // add title needed by template
                countriesFilteredByContinent.push(extend(country, {
                    title: country.name,
                    id: key })
                );
            }
        }

        return countriesFilteredByContinent;
    }

    render () {
        return (
            <ListMapTemplate data={this.state.matchedCountries}
                enableSearch={true}
                searchString={this.state.searchString}
                onSearch={this._handleSearch}
                onClickItem={this._handleClickItem} />
        );
    }
}