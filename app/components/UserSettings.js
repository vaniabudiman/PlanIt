import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from "react-native-router-flux";
import { TouchableOpacity } from "@shoutem/ui";


export default function UserSettings () {
    return (
        <TouchableOpacity onPress={Actions.userProfile}>
            <Icon name="user" size={20} />
        </TouchableOpacity>
    );
}