/*
 * Inspired by & source credit: http://browniefed.com/blog/react-native-layout-examples/
*/
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  NetInfo
} from "react-native";
import { Actions, ActionConst } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import LoginStyles from "../styles/LoginStyles.js";
import { login, forgotPassword } from "../actions/accountActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import FORM from "../constants/formConstants.js";
import { connect } from "react-redux";
import realm from "../../Realm/realm.js";


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
            connectionInfo: null
        };

        this.requireAuthentication(this.props.loginStatus);

        // Bind Redux action creators
        this._login = () => this.props.dispatch(login(this.state));
        this._forgotPassword = () => this.props.dispatch(forgotPassword(this.state));

        this._handleConnectionInfoChange = this._handleConnectionInfoChange.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        this.requireAuthentication(nextProps.loginStatus);
    }

    componentDidMount () {
        NetInfo.addEventListener(
            "change",
            this._handleConnectionInfoChange
        );
        NetInfo.fetch().done(
            (connectionInfo) => { this.setState({ connectionInfo }); }
        );
    }

    componentWillUnmount () {
        NetInfo.removeEventListener(
            "change",
            this._handleConnectionInfoChange
        );
    }

    _handleConnectionInfoChange = (connectionInfo) => {
        this.setState({
            connectionInfo,
        });
        this.requireAuthentication(this.props.loginStatus);
    };


    requireAuthentication (loginStatus) {
        if (this.state.connectionInfo === "NONE" && realm.objects("Session")[0].session) {
            Actions.trips({ type: ActionConst.RESET });
        }
        if (loginStatus === FETCH_STATUS.SUCCESS) {
            let allSessions = realm.objects("Session");
            realm.write(() => {
                realm.delete(allSessions);
                realm.create("Session", {
                    userName: this.state.userName,
                    password: this.state.password,
                    session: true
                });
            });
            Actions.trips({ type: ActionConst.RESET });
        }
        // Other statuses as necessary
    }

    render () {
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
                            <TextInput style={LoginStyles.input}
                                    placeholder="Username"
                                    placeholderTextColor="#FFF"
                                    multiline={false}
                                    maxLength={FORM.CHAR_LIMIT}
                                    onChangeText={(userName) => this.setState({
                                        userName: userName.replace(FORM.REPLACE_REGEX, "")
                                    })}
                                    value={this.state.userName}
                                    underlineColorAndroid="rgba(250, 250, 250, 0.8)" />
                        </View>
                        <View style={LoginStyles.inputWrap}>
                            <View style={LoginStyles.iconWrap}>
                                <Icon name="key" style={LoginStyles.icon} resizeMode="contain" />
                            </View>
                            <TextInput style={LoginStyles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#FFF"
                                    multiline={false}
                                    maxLength={FORM.CHAR_LIMIT}
                                    onChangeText={(pass) => this.setState({
                                        password: pass.replace(FORM.REPLACE_REGEX, "")
                                    })}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    underlineColorAndroid="rgba(250, 250, 250, 0.8)" />
                        </View>
                        <TouchableOpacity activeOpacity={.5}>
                            <View>
                                <Text style={LoginStyles.forgotPasswordText} onPress={this._forgotPassword}>Forgot Password?</Text>
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