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
import SignUpStyles from "../styles/SignUpStyles.js";
import { signup } from "../core/Actions.js";
import { connect } from "react-redux";


class SignUpView extends Component {

    static propTypes = {
        dispatch: React.PropTypes.func,
        signupStatusCode: React.PropTypes.string,
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
    }

    componentWillMount () {
        this.requireAuthentication(this.props.signupStatusCode);

        // Bind Redux action creators
        this._signup = () => this.props.dispatch(signup(this.state));
    }

    componentWillReceiveProps (nextProps) {
        this.requireAuthentication(nextProps.signupStatusCode);
    }

    requireAuthentication (loginStatus) {
        if (loginStatus === "201") {
            Actions.login({ type: ActionConst.RESET });
        }
        // Other statuses as necessary
    }

    render () {
        return (
            <View style={SignUpStyles.container}>
                <Image source={{ uri: "login" }}
                        style={[SignUpStyles.container, SignUpStyles.bg]}
                        resizeMode="cover">
                    <View style={SignUpStyles.headerContainer}>
                        <View style={SignUpStyles.headerIconView}>
                            <TouchableOpacity style={SignUpStyles.headerBackButtonView}>
                                <Icon name="angle-left" style={SignUpStyles.backButtonIcon} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                        <View style={SignUpStyles.headerTitleView}>
                            <Text style={SignUpStyles.titleViewText}>Sign Up</Text>
                        </View>
                    </View>
                    <View style={SignUpStyles.inputsContainer}>
                        <View style={SignUpStyles.inputContainer}>
                            <View style={SignUpStyles.iconContainer}>
                                <Icon name="user-o" style={SignUpStyles.inputIcon} resizeMode="contain" />
                            </View>
                            <TextInput style={[SignUpStyles.input]}
                                    placeholder="Name"
                                    placeholderTextColor="#FFF"
                                    underlineColorAndroid="transparent" />
                        </View>
                        <View style={SignUpStyles.inputContainer}>
                            <View style={SignUpStyles.iconContainer}>
                                <Icon name="envelope-o" style={SignUpStyles.inputIcon} resizeMode="contain" />
                            </View>
                            <TextInput style={[SignUpStyles.input]}
                                    placeholder="Email"
                                    placeholderTextColor="#FFF" />
                        </View>
                        <View style={SignUpStyles.inputContainer}>
                            <View style={SignUpStyles.iconContainer}>
                                <Icon name="key" style={SignUpStyles.inputIcon} resizeMode="contain" />
                            </View>
                            <TextInput secureTextEntry={true}
                                    style={[SignUpStyles.input]}
                                    placeholder="Password"
                                    placeholderTextColor="#FFF" />
                        </View>
                    </View>
                    <View style={SignUpStyles.footerContainer}>
                        <TouchableOpacity onPress={this._signup}>
                            <View style={SignUpStyles.signup}>
                                <Text style={SignUpStyles.whiteFont}>Join</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={SignUpStyles.signin}>
                                <Text style={SignUpStyles.greyFont}>
                                    Already have an account?
                                    <Text style={SignUpStyles.whiteFont} onPress={Actions.login}> Sign In</Text>
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
        signupStatusCode: state.app.signupStatusCode,
    };
})(SignUpView);