import React, { Component } from "react";
import { Text } from "react-native";
import Countries from "../data/countries.json";
import { filter } from "underscore";
import { ListView, View, Row } from "@shoutem/ui";


export default class CountriesView extends Component {

    constructor (props) {
        super(props);
    }

    static propTypes = {
        continent: React.PropTypes.string
    }

    renderRow (country) {
        return (
            <Row>
                <View styleName="vertical">
                    <Text>{country.name}</Text>
                </View>
            </Row>
        );
    }

    render () {
        const selectedContinent = this.props.continent;
        const countriesFilteredByContinent = filter(Countries.countries,
            function (country) { return country.continent === selectedContinent; });
        return (
            <View>
                <ListView
                    data={countriesFilteredByContinent}
                    renderRow={country => this.renderRow(country)}
                />
            </View>
        );
    }
}