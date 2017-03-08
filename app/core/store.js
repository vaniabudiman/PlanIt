import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import { isDevMode } from "../utils/utils.js";
import AppReducer from "./Reducer.js";
import AccountReducer from "../reducers/accountReducer.js";
import CitiesReducer from "../reducers/citiesReducer.js";
import AttractionsReducer from "../reducers/attractionsReducer.js";
import EventsReducer from "../reducers/eventsReducer.js";
import BookmarksReducer from "../reducers/bookmarksReducer.js";
import TripsReducer from "../reducers/tripsReducer";


var createStoreWithMiddleware = applyMiddleware(
    thunk,
    // Logger Middleware to help in debugging Redux. This always has to be last & predicate b/c only run in dev mode.
    createLogger({ predicate: () => isDevMode() })
)(createStore);

var baseReducers = {
    app: AppReducer,
    account: AccountReducer,
    cities: CitiesReducer,
    attractions: AttractionsReducer,
    events: EventsReducer,
    bookmarks: BookmarksReducer,
    trips: TripsReducer,
};

var store = (function configureStore (initialState) {
    return createStoreWithMiddleware(
        combineReducers(baseReducers),
        initialState
    );
})();

store.baseReducers = baseReducers;

export default store;