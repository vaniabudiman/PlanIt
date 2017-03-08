/*
 * Inspired by & source credit: http://browniefed.com/blog/react-native-layout-examples/
*/
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Actions, ActionConst } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import LoginStyles from "../styles/LoginStyles.js";
import { login } from "../actions/accountActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import { connect } from "react-redux";


class LoginView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        loginStatus: React.PropTypes.string,
    }

    constructor (props) {
        super(props);

        this.state = {
            userName: "",
            password: "",
        };

        this.requireAuthentication(this.props.loginStatus);

        // Bind Redux action creators
        this._login = () => this.props.dispatch(login(this.state));
    }

    componentWillReceiveProps (nextProps) {
        this.requireAuthentication(nextProps.loginStatus);
    }

    requireAuthentication (loginStatus) {
        if (loginStatus === FETCH_STATUS.SUCCESS) {
            Actions.trips({ type: ActionConst.RESET });
        }
        // Other statuses as necessary
    }

    render () {
        const limit = 40;
        return (
            <View style={LoginStyles.container}>
                {/*TODO: testing rest api call status, remove later on*/}
                <Image source={{ uri: "login" }} style={LoginStyles.background} resizeMode="cover">
                    <View style={LoginStyles.markWrap}>
                        <Text style={LoginStyles.brandWrap}>
                            <Text style={LoginStyles.planText}>Plan</Text>
                            <Text style={LoginStyles.itText}>It</Text>&nbsp;
                            <Icon name="plane" style={LoginStyles.brandIcon} resizeMode="contain" />
                        </Text>
                    </View>
                    <View style={LoginStyles.wrapper}>
                        <View style={LoginStyles.inputWrap}>
                            <View style={LoginStyles.iconWrap}>
                                <Icon name="user-circle" style={LoginStyles.icon} resizeMode="contain" />
                            </View>
                            <TextInput placeholder="Username"
                                    placeholderTextColor="#FFF"
                                    multiline={false}
                                    maxLength={limit}
                                    onChangeText={userName => this.setState({ userName })}
                                    style={LoginStyles.input}
                                    underlineColorAndroid="rgba(250, 250, 250, 0.8)" />
                        </View>
                        <View style={LoginStyles.inputWrap}>
                            <View style={LoginStyles.iconWrap}>
                                <Icon name="key" style={LoginStyles.icon} resizeMode="contain" />
                            </View>
                            <TextInput placeholderTextColor="#FFF"
                                    placeholder="Password"
                                    multiline={false}
                                    maxLength={limit}
                                    style={LoginStyles.input}
                                    onChangeText={password => this.setState({ password })}
                                    secureTextEntry={true}
                                    underlineColorAndroid="rgba(250, 250, 250, 0.8)" />
                        </View>
                        <TouchableOpacity activeOpacity={.5}>
                            <View>
                                <Text style={LoginStyles.forgotPasswordText}>Forgot Password?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.5} onPress={this._login}>
                            <View style={LoginStyles.button}>
                                <Text style={LoginStyles.buttonText}>Sign In</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={LoginStyles.container}>
                        <View style={LoginStyles.signupWrap}>
                            <Text style={LoginStyles.accountText}>Don't have an account?</Text>
                            <TouchableOpacity activeOpacity={.5}>
                                <View>
                                    <Text style={LoginStyles.signupLinkText} onPress={Actions.signUp}>Sign Up!</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Image>
            </View>
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        loginStatus: state.account.loginStatus,
    };
})(LoginView);