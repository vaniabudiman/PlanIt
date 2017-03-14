import { Types } from "./Actions.js";
// import update from "re-muatable";    // TODO: find replacement library for this


const initialState = {
    // default initial state
};

export default function (state = initialState, action) {
    var nextState = state;

    switch (action.type) {
        case Types.SET:
            // nextState = update.set(nextState, action.path, action.value);
            break;
        default:
            return state;
    }
    return nextState;
}