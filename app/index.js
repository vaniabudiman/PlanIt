/**
 * PlanIt app entry point
 */
import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { Router, Scene } from "react-native-router-flux";
import { AppRegistry } from "react-native";
import store from "./core/store.js";
import HomeView from "./layouts/HomeView.js";
import GrayView from "./layouts/GrayView.js";
import ScarletView from "./layouts/ScarletView.js";
import BasicListView from "./layouts/BasicListView.js";
import { NavigationStyles } from "./styles/NavigationStyles.js";


// Connect the router to the Redux store
const RouterWithRedux = connect()(Router);

export default class PlanIt extends Component {

    render () {
        return (
            // Wrap routes with Redux Provider
            <Provider store={store}>
                <RouterWithRedux>
                    <Scene key="root">
                        <Scene key="home" component={HomeView} title="Home View" inital={true} />
                        <Scene key="scarlet" component={ScarletView} title="Scarlet View" />
                        <Scene key="gray" component={GrayView} title="Gray View" />
                        <Scene key="basicList" component={BasicListView}
                        sceneStyle={ NavigationStyles.listViewScene } title="Basic List View" />
                    </Scene>
                </RouterWithRedux>
            </Provider>
        );
    }
}

AppRegistry.registerComponent("PlanIt", () => PlanIt);