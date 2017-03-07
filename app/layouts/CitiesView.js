import React, { Component } from "react";
import { connect } from "react-redux";
import { getCities } from "../actions/citiesActions.js";
import { Text } from "@shoutem/ui";

class CitiesView extends Component {

    constructor (props) {
        super(props);
    }

    static propTypes = {
        dispatch: React.PropTypes.func,
        country: React.PropTypes.string,
        cities: React.PropTypes.array
    }

    componentWillMount () {

        // Bind Redux action creators
        this.props.dispatch(getCities(this.props.country));
    }

    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by name
        alert("clicked on cities: " + item.name);
    }

    render () {
        const selectedCountry = this.props.country;
        // generate cities by filtering by country
        return (
            <Text>{this.props.cities.length} of {selectedCountry}</Text>
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        cities: state.cities.items,
    };
})(CitiesView);