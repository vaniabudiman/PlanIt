import React, { Component } from "react";
import Countries from "../data/countries.json";
import { extend } from "underscore";
import ListMapTemplate from "../templates/ListMapTemplate.js";
import { Actions } from "react-native-router-flux";


export default class CountriesView extends Component {

    constructor (props) {
        super(props);

        // Bind callback handlers
        this._handleClickItem = this._handleClickItem.bind(this);
    }

    static propTypes = {
        continent: React.PropTypes.string
    }

    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by name
        Actions.cities({ country: item.id });

    }

    render () {
        const selectedContinent = this.props.continent;
        const countriesFilteredByContinent = [];

        for (var key in Countries.countries) {
            let country = Countries.countries[key];
            if (country.continent === selectedContinent) {
                // add title needed by template
                countriesFilteredByContinent.push(extend(country, {
                    title: country.name,
                    id: key })
                );
            }
        }

        return (
            <ListMapTemplate data={countriesFilteredByContinent}
                onClickItem={this._handleClickItem} />
        );
    }
}