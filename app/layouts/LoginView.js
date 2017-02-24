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
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import LoginStyles from "../styles/LoginStyles.js";


export default class LoginView extends Component {
    render () {
        return (
            <View style={LoginStyles.container}>
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
                                    style={LoginStyles.input} />
                        </View>
                        <View style={LoginStyles.inputWrap}>
                            <View style={LoginStyles.iconWrap}>
                                <Icon name="key" style={LoginStyles.icon} resizeMode="contain" />
                            </View>
                            <TextInput placeholderTextColor="#FFF"
                                    placeholder="Password"
                                    style={LoginStyles.input}
                                    secureTextEntry={true} />
                        </View>
                        <TouchableOpacity activeOpacity={.5}>
                            <View>
                                <Text style={LoginStyles.forgotPasswordText}>Forgot Password?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.5}>
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