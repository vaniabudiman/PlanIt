import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import AppReducer from "./Reducer.js";


var createStoreWithMiddleware = applyMiddleware(
    thunk,
    // Logger Middleware to help in debugging Redux. This always has to be last & predicate b/c only run in dev mode.
    createLogger({ predicate: () => process.env.NODE_ENV === "development" })
)(createStore);

var baseReducers = {
    app: AppReducer
};

var store = (function configureStore (initialState) {
    return createStoreWithMiddleware(
        combineReducers(baseReducers),
        initialState
    );
})();

store.baseReducers = baseReducers;

export default store;