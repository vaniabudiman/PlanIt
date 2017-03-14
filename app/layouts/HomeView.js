import React, { Component } from "react";
import { View, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import realm from "../../Realm/realm.js";
import { GlobalStyles, $blue } from "../styles/GlobalStyles.js";


class HomeView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        count: React.PropTypes.number
    }

    constructor (props) {
        super(props);
    }

    render () {
        return (
            <View style={[GlobalStyles.container, { backgroundColor: $blue }]}>
                <Text style={GlobalStyles.text}>Welcome to our App!</Text>
                <Text style={GlobalStyles.text} onPress={Actions.continents}>Go to Continents View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.tripHome}>Go to Trip Home View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.login}>Go to Login View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.signUp}>Go to Sign Up View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.bookmarks}>Bookmarks View</Text>

                <Text style={GlobalStyles.text} onPress={Actions.trips}>Trips View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.itemDetails}>Item / Details View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.formView}>Form View</Text>

                {
                    /*
                     * TODO:
                     *  Currently a new "Dog" is written each time the app starts up / reloads.
                     *  This might eat up your avd's allocated storage... if it does, just go into
                     *  settings & clear the storage for the "PlanIt" app as you would on your phone.
                     *
                     *  We'll need to look into Realm more & really figure out how it all works...
                    */
                }
                <Text style={GlobalStyles.text}>Count of Trips in Realm: {realm.objects("Trip").length}</Text>
            </View>
        );
    }
}

// Connect the HomeView to the Redux store
export default connect((state) => {
    // mapStateToProps
    return {
        all: state // TODO: demo only; remove and do props as needed
    };
})(HomeView);