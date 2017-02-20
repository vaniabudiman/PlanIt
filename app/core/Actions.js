export const Types = {
    SET: "SET",
    // TODO: testing demonstration only, remove later on
    INC: "INC"
};

export function set (path, value) {
    return {
        type: Types.SET,
        path: path,
        value: value
    };
}

// TODO: testing demonstration only, remove later on
export function inc () {
    return {
        type: Types.INC
    };
}