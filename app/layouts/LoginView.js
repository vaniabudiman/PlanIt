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
import { login } from "../core/Actions.js";
import { connect } from "react-redux";


class LoginView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        statusCode: React.PropTypes.string,
    }

    constructor (props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
        };
    }

    componentWillMount () {
        this.requireAuthentication(this.props.statusCode);

        // Bind Redux action creators
        this._login = () => this.props.dispatch(login(this.state));
    }

    componentWillReceiveProps (nextProps) {
        this.requireAuthentication(nextProps.statusCode);
    }

    requireAuthentication (loginStatus) {
        if (loginStatus === "201") {
            Actions.trips({ type: ActionConst.RESET });
        }
        // Other statuses as necessary
    }

    render () {
        const limit = 40;
        return (
            <View style={LoginStyles.container}>
                {/*TODO: testing rest api call status, remove later on*/}
                <Text>{"Login Status: " + this.props.statusCode}</Text>
                <Image source={{ uri: "login" }} style={LoginStyles.background} resizeMode="cover">
                    <View style={LoginStyles.markWrap}>
                        <Icon name="check" style={LoginStyles.mark} resizeMode="contain" />
                    </View>
                    <View style={LoginStyles.wrapper}>
                        <View style={LoginStyles.inputWrap}>
                            <View style={LoginStyles.iconWrap}>
                                <Icon name="user-o" style={LoginStyles.icon} resizeMode="contain" />
                            </View>
                            <TextInput placeholder="Username"
                                    placeholderTextColor="#FFF"
                                    multiline={false}
                                    maxLength={limit}
                                    onChangeText={userName => this.setState({ userName })}
                                    style={LoginStyles.input} />
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
                                    secureTextEntry={true} />
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
                            <Text style={LoginStyles.accountText}>Don"t have an account?</Text>
                            <TouchableOpacity activeOpacity={.5}>
                                <View>
                                    <Text style={LoginStyles.signupLinkText} onPress={Actions.signUp}>Sign Up</Text>
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
        statusCode: state.app.statusCode, // TODO: testing rest api call status, remove later on
    };
})(LoginView);