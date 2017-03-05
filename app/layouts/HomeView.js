import React, { Component } from "react";
import { View, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import realm from "../../Realm/realm.js";
import { GlobalStyles, $blue, $gray } from "../styles/GlobalStyles.js";
import { inc } from "../core/Actions.js";


class HomeView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        count: React.PropTypes.number
    }

    constructor (props) {
        super(props);
    }

    componentWillMount () {
        // Bind Redux action creators
        // TODO: testing demonstration only, remove later on
        this._handleInc = () => this.props.dispatch(inc());
    }

    render () {
        return (
            <View style={[GlobalStyles.container, { backgroundColor: $blue }]}>
                <Text style={GlobalStyles.text}>Welcome to our App!</Text>
                <Text style={GlobalStyles.text} onPress={Actions.formView}>Go to Form View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.basicMapView}>Go to Map View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.continents}>Go to Continents View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.tripHome}>Go to Trip Home View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.login}>Go to Login View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.signUp}>Go to Sign Up View</Text>

                <Text style={GlobalStyles.text} onPress={Actions.trips}>Trips View</Text>
                <Text style={GlobalStyles.text} onPress={Actions.itemDetails}>Item / Details View</Text>

                <Text style={GlobalStyles.text}>{"Count: " + this.props.count}</Text>
                <Icon.Button name="plus" backgroundColor={$gray} onPress={this._handleInc}>
                    Click me to Increment count
                </Icon.Button>
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
        count: state.app.count // TODO: testing demonstration only, remove later on
    };
})(HomeView);