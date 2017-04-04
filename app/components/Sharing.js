import React, { Component } from "react";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from "react-native-router-flux";
import { TouchableOpacity } from "@shoutem/ui";
import { getShared } from "../actions/sharingActions.js";


class Sharing extends Component {

    static propTypes = {
        count: React.PropTypes.number,
        dispatch: React.PropTypes.func
    }

    constructor (props) {
        super(props);

        this.requestShared(this.props.dispatch);
    }

    requestShared (dispatch) {
        dispatch(getShared(true));
    }

    render () {
        return (
            <TouchableOpacity onPress={Actions.shareList}>
                <Icon name="share-alt" size={20} />
                {this.props.count > 0 && <Icon name="circle" color="red" />}
            </TouchableOpacity>
        );
    }
    
}

export default connect((state) => {
    return {
        count: state.sharing.count
    };
})(Sharing);