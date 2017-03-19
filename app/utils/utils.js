export function isDevMode () {
    return process.env.NODE_ENV === "development";
}

export function getTypesDisplayString (types) {
    // Reformat google's types (https://developers.google.com/places/web-service/supported_types)
    // into string suitable for displaying
    return types.filter((type) => !["point_of_interest", "establishment"].includes(type))
                .map((type) => type.replace(/_/g, " "))
                .join(", ");
}

export function getPriceLevelString(level) {
        let formattedLevel;
        switch (level) {
            case 0:
                formattedLevel = "Free";
                break;
            case 1:
                formattedLevel = "Inexpensive";
                break;
            case 2:
                formattedLevel = "Moderate";
                break; 
            case 3:
                formattedLevel = "Expensive";
                break;
            case 4:
                formattedLevel = "Very Expensive";
                break;
            default:
                formattedLevel = "N/A"
                break;
        }

        return formattedLevel;
    }

// source credit: https://github.com/airbnb/react-native-maps/issues/505
export function getRegionForCoordinates (points) {
  // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    ((point) => {
        minX = point.latitude;
        maxX = point.latitude;
        minY = point.longitude;
        maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
        minX = Math.min(minX, point.latitude);
        maxX = Math.max(maxX, point.latitude);
        minY = Math.min(minY, point.longitude);
        maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX);
    const deltaY = (maxY - minY);

    return {
        latitude: midX,
        longitude: midY,
        latitudeDelta: deltaX,
        longitudeDelta: deltaY
    };
}