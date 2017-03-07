/**
 * PlanIt app entry point
 */
import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { Router, Scene } from "react-native-router-flux";
import { AppRegistry } from "react-native";
import store from "./core/store.js";
import HomeView from "./layouts/HomeView.js";
import FormView from "./layouts/FormView.js";
import TripsView from "./layouts/TripsView.js";
import { NavigationStyles } from "./styles/NavigationStyles.js";
import UserSettings from "./components/UserSettings.js";
import UserProfileView from "./layouts/UserProfileView.js";
import ItemDetailsView from "./layouts/ItemDetailsView.js";
import ContinentsView from "./layouts/ContinentsView.js";
import CountriesView from "./layouts/CountriesView.js";
import CitiesView from "./layouts/CitiesView.js";
import AttractionsView from "./layouts/AttractionsView.js";
import TripHomeView from "./layouts/TripHomeView.js";
import LoginView from "./layouts/LoginView.js";
import SignUpView from "./layouts/SignUpView.js";
import BookmarksView from "./layouts/BookmarksView.js";


// Connect the router to the Redux store
const RouterWithRedux = connect()(Router);

export default class PlanIt extends Component {

    constructor (props) {
        super(props);
    }

    render () {
        let navBarProps = {
            renderRightButton: UserSettings
        };

        return (
            // Wrap routes with Redux Provider
            <Provider store={store}>
                <RouterWithRedux>
                    <Scene key="root">
                        <Scene key="login" component={LoginView} title="Login" hideNavBar={true} initial={true} />
                        <Scene key="signUp" component={SignUpView} title="Sign Up" hideNavBar={true} />

                        <Scene key="trips" component={TripsView}
                            sceneStyle={ NavigationStyles.listViewScene } title="Trips" {...navBarProps} />
                        <Scene key="tripHome" component={TripHomeView} title="Trip Homepage"
                            sceneStyle={NavigationStyles.tripHomeViewScene} {...navBarProps} />

                        <Scene key="continents" component={ContinentsView} title="Continents"
                            sceneStyle={NavigationStyles.continentsViewScene} {...navBarProps} />
                        <Scene key="countries" component={CountriesView} title="Countries"
                            sceneStyle={NavigationStyles.listViewScene} {...navBarProps} />
                        <Scene key="cities" component={CitiesView} title="Cities"
                            sceneStyle={NavigationStyles.listViewScene} {...navBarProps} />
                        <Scene key="attractions" component={AttractionsView} title="Attractions"
                            sceneStyle={NavigationStyles.listViewScene} {...navBarProps} />

                        <Scene key="bookmarks" component={BookmarksView}
                            sceneStyle={ NavigationStyles.listViewScene } title="Bookmarks" {...navBarProps} />


                        { /* TODO: remove these... testing / examples for now */ }
                        <Scene key="home" component={HomeView} title="Home View" inital={true} {...navBarProps} />

                        <Scene key="itemDetails" component={ItemDetailsView}
                            sceneStyle={ NavigationStyles.listViewScene } title="Item / Details" />

                        <Scene key="formView" component={FormView}
                            sceneStyle={ NavigationStyles.listViewScene } title="Form View" {...navBarProps} />

                        <Scene key="userProfile" component={UserProfileView} title="User Profile" />
                    </Scene>
                </RouterWithRedux>
            </Provider>
        );
    }
}

AppRegistry.registerComponent("PlanIt", () => PlanIt);