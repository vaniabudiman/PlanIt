import React, { Component } from "react";
import { connect } from "react-redux";
import { getAttractions } from "../actions/attractionsActions.js";
import { View, Text } from "@shoutem/ui";

class AttractionsView extends Component {

    constructor (props) {
        super(props);

        // Bind Redux action creators
        this.props.dispatch(getAttractions(this.props.city, this.props.pageToken));
    }

    static propTypes = {
        dispatch: React.PropTypes.func,
        city: React.PropTypes.string,
        attractions: React.PropTypes.array,
        pageToken: React.PropTypes.string
    }

    _handleClickItem (item) {
        // Make necessary calls to do w/e you want when clicking on item identified by name
        alert("clicked on attraction: " + item.name);
    }

    render () {
        const selectedCity = this.props.city;
        // generate attractions by filtering by city, etc.
        return (
            <View>
                <Text>{this.props.attractions.length} of {selectedCity}</Text>
                <Text>page token: {this.props.pageToken}</Text>
            </View>
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        attractions: state.attractions.items,
        pageToken: state.attractions.pageToken
    };
})(AttractionsView);