import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from "react-native-router-flux";


export default function UserSettings () {
    return <Icon name="user" size={20} onPress={Actions.userProfile} />;
}