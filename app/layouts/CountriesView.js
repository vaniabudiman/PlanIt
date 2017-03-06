import React, { Component } from "react";
import Countries from "../data/countries.json";
import { filter } from "underscore";
import ListMapTemplate from "../templates/ListMapTemplate.js";


export default class CountriesView extends Component {

    constructor (props) {
        super(props);
    }

    static propTypes = {
        continent: React.PropTypes.string
    }

    _handleClickItem (name) {
        // Make necessary calls to do w/e you want when clicking on item identified by name
        alert("clicked on country: " + name);
    }

    render () {
        const selectedContinent = this.props.continent;
        const countriesFilteredByContinent = filter(Countries.countries,
            function (country) { return country.continent === selectedContinent; });
        return (
            <ListMapTemplate data={countriesFilteredByContinent}
                onClickItem={this._handleClickItem} />
        );
    }
}