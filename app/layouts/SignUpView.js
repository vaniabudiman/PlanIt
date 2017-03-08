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
  Picker
} from "react-native";
import { Actions, ActionConst } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import SignUpStyles from "../styles/SignUpStyles.js";
import { signup } from "../actions/accountActions.js";
import FETCH_STATUS from "../constants/fetchStatusConstants.js";
import FORM from "../constants/formConstants.js";
import { connect } from "react-redux";


class SignUpView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        signupStatus: React.PropTypes.string,
    }

    constructor (props) {
        super(props);

        this.state = {
            // TODO: view textinputs need to set these states; see LoginView.js for onChangeText usage
            userName: "",
            password: "",
            name: "",
            email: "",
            homeCurrency: "",
        };

        this.requireAuthentication(this.props.signupStatus);

        // Bind Redux action creators
        this._signup = () => this.props.dispatch(signup(this.state));
    }

    componentWillReceiveProps (nextProps) {
        this.requireAuthentication(nextProps.signupStatus);
    }

    requireAuthentication (signUpStatus) {
        if (signUpStatus === FETCH_STATUS.SUCCESS) {
            Actions.login({ type: ActionConst.RESET });
        }
        // Other statuses as necessary
    }

    render () {
        return (
            <View style={SignUpStyles.container}>
                <Image source={{ uri: "login" }}
                        style={[SignUpStyles.container, SignUpStyles.background]}
                        resizeMode="cover">
                    <View style={SignUpStyles.markWrap}>
                        <Text style={SignUpStyles.brandWrap}>
                            <Text style={SignUpStyles.planText}>Plan</Text>
                            <Text style={SignUpStyles.itText}>It</Text>&nbsp;
                            <Icon name="plane" style={SignUpStyles.brandIcon} resizeMode="contain" />
                        </Text>
                        <Text style={SignUpStyles.signUpText}>Sign Up</Text>
                    </View>
                    <View style={SignUpStyles.inputsContainer}>
                        <View style={SignUpStyles.inputContainer}>
                            <View style={SignUpStyles.iconContainer}>
                                <Icon name="user-circle" style={SignUpStyles.inputIcon} resizeMode="contain" />
                            </View>
                            <TextInput style={[SignUpStyles.input]}
                                    placeholder="Name"
                                    placeholderTextColor="#FFF"
                                    multiline={false}
                                    maxLength={FORM.CHAR_LIMIT}
                                    onChangeText={(name) => this.setState({ name: name })}
                                    value={this.state.name}
                                    underlineColorAndroid="rgba(250, 250, 250, 0.8)" />
                        </View>
                        <View style={SignUpStyles.inputContainer}>
                            <View style={SignUpStyles.iconContainer}>
                                <Icon name="id-badge" style={SignUpStyles.inputIcon} resizeMode="contain" />
                            </View>
                            <TextInput style={[SignUpStyles.input]}
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
                        <View style={SignUpStyles.inputContainer}>
                            <View style={SignUpStyles.iconContainer}>
                                <Icon name="envelope-o" style={SignUpStyles.inputIcon} resizeMode="contain" />
                            </View>
                            <TextInput style={[SignUpStyles.input]}
                                    placeholder="Email"
                                    placeholderTextColor="#FFF"
                                    multiline={false}
                                    maxLength={FORM.CHAR_LIMIT}
                                    onChangeText={(email) => this.setState({
                                        email: email.replace(FORM.REPLACE_REGEX, "")
                                    })}
                                    value={this.state.email}
                                    underlineColorAndroid="rgba(250, 250, 250, 0.8)" />
                        </View>
                        <View style={SignUpStyles.inputContainer}>
                            <View style={SignUpStyles.iconContainer}>
                                <Icon name="key" style={SignUpStyles.inputIcon} resizeMode="contain" />
                            </View>
                            <TextInput secureTextEntry={true}
                                    style={[SignUpStyles.input]}
                                    placeholder="Password"
                                    placeholderTextColor="#FFF"
                                    multiline={false}
                                    maxLength={FORM.CHAR_LIMIT}
                                    onChangeText={(pass) => this.setState({
                                        password: pass.replace(FORM.REPLACE_REGEX, "")
                                    })}
                                    value={this.state.password}
                                    underlineColorAndroid="rgba(250, 250, 250, 0.8)" />
                        </View>
                        <View style={SignUpStyles.inputContainer}>
                            <View style={SignUpStyles.iconContainer}>
                                <Icon name="dollar" style={SignUpStyles.inputIcon} resizeMode="contain" />
                            </View>
                            <Picker style={SignUpStyles.picker}
                                    selectedValue={this.state.currency}
                                    onValueChange={(curr) => {
                                        this.setState({ currency: curr });
                                        this.setState({ homeCurrency: curr });
                                    }}>
                                    {/* TODO: populate w/ available currencies */}
                                    <Picker.Item label="Select Home Currency" value="" />
                                    <Picker.Item label="USD (United States)" value="usd" />
                                    <Picker.Item label="CAD (Canadian)" value="cad" />
                                    <Picker.Item label="GBP (British Pounds)" value="gpb" />
                                    <Picker.Item label="EUR (Euro)" value="eur" />
                            </Picker>
                        </View>
                    </View>
                    <View style={SignUpStyles.footerContainer}>
                        <TouchableOpacity onPress={this._signup}>
                            <View style={SignUpStyles.signup}>
                                <Text style={SignUpStyles.buttonText}>Join</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={SignUpStyles.signin}>
                                <Text style={SignUpStyles.accountText}>
                                    Already have an account?
                                    <Text style={SignUpStyles.signinLinkText} onPress={Actions.login}> Sign In</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Image>
            </View>
        );
    }
}

export default connect((state) => {
    // mapStateToProps
    return {
        signupStatus: state.account.signupStatus,
    };
})(SignUpView);
