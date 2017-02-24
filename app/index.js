/**
 * PlanIt app entry point
 */
import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { Router, Scene } from "react-native-router-flux";
import { AppRegistry } from "react-native";
import store from "./core/store.js";
import HomeView from "./layouts/HomeView.js";
import BasicMapView from "./layouts/BasicMapView.js";
import FormView from "./layouts/FormView.js";
import BasicListView from "./layouts/BasicListView.js";
import { NavigationStyles } from "./styles/NavigationStyles.js";
import UserSettings from "./components/UserSettings.js";
import UserProfileView from "./layouts/UserProfileView.js";
import DescriptionView from "./layouts/DescriptionView.js";
import ContinentsView from "./layouts/ContinentsView.js";
import TripHomeView from "./layouts/TripHomeView.js";


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
                        <Scene key="home" component={HomeView} title="Home View" inital={true} {...navBarProps} />
                        <Scene key="continents" component={ContinentsView} title="Continents"
                            sceneStyle={NavigationStyles.continentsViewScene} {...navBarProps} />
                        <Scene key="tripHome" component={TripHomeView} title="Trip Homepage"
                            sceneStyle={NavigationStyles.tripHomeViewScene} {...navBarProps} />
                        <Scene key="formView" component={FormView} title="Form View" {...navBarProps} />
                        <Scene key="basicMapView" component={BasicMapView} title="Basic Map View" {...navBarProps} />
                        <Scene key="basicList" component={BasicListView}
                            sceneStyle={ NavigationStyles.listViewScene } title="Basic List View" {...navBarProps} />
                        <Scene key="userProfile" component={UserProfileView} title="User Profile" />
                        <Scene key="descriptionView" component={DescriptionView}
                            sceneStyle={ NavigationStyles.listViewScene } title="Description View" />
                    </Scene>
                </RouterWithRedux>
            </Provider>
        );
    }
}

AppRegistry.registerComponent("PlanIt", () => PlanIt);