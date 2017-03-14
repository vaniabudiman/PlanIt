export const Types = {
    SET: "SET"
};

export function set (path, value) {
    return {
        type: Types.SET,
        path: path,
        value: value
    };
}