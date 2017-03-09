export function isDevMode () {
    return process.env.NODE_ENV === "development";
}

export function getTypesDisplayString (types) {
    // Reformat google's types (https://developers.google.com/places/web-service/supported_types)
    // into string suitable for displaying
    return types.filter((type) => type !== "point_of_interest")
                .map((type) => type.replace(/_/g, " "))
                .join(", ");
}