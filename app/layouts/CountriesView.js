import React, { Component } from "react";
import Countries from "../data/countries.json";
import { filter, extend } from "underscore";
import ListMapTemplate from "../templates/ListMapTemplate.js";


export default class CountriesView extends Component {

    constructor (props) {
        super(props);
    }

    static propTypes = {
        continent: React.PropTypes.string
    }

    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by name
        alert("clicked on country: " + item.name);
    }

    render () {
        const selectedContinent = this.props.continent;
        const countriesFilteredByContinent = filter(Countries.countries, (country) => {
            if (country.continent === selectedContinent) {
                return extend(country, { title: country.name });    // add title needed by template
            }
        });

        return (
            <ListMapTemplate data={countriesFilteredByContinent}
                onClickItem={this._handleClickItem} />
        );
    }
}