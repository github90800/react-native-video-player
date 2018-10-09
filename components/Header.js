import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import PropTypes from 'prop-types';
import {getStatusBarHeight} from "react-native-status-bar-height";

class Header extends Component {
    render() {
        const statusBarHeight = getStatusBarHeight();
        return (
            <View style={{height: statusBarHeight, backgroundColor: this.props.backgroundColor}}>
            </View>
        );
    }
}

Header.propTypes = {
    backgroundColor: PropTypes.string.isRequired,
}

export default Header;
