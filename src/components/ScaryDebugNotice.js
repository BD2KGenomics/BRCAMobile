import React, {Component} from 'react';
import {
    Text, TouchableOpacity, StyleSheet, Platform
} from "react-native";
import {Navigation} from 'react-native-navigation';
import {connect} from "react-redux";

import {set_debugging} from "../redux/debugging/actions";

class ScaryDebugNotice extends Component {
    constructor(props) {
        super(props);

        this.moveToDebugScreen = this.moveToDebugScreen.bind(this);
    }

    moveToDebugScreen() {
        Navigation.handleDeepLink({
            link: 'main/' + JSON.stringify({
                title: 'Dev Setings',
                screen: 'brca.DebugScreen'
            })
        });
    }

    render() {
        if (!this.props.isDebugging || this.props.isDebugMsgHidden) {
            return null;
        }

        const extraStyles = {
            // margin: (Platform.OS === 'ios') ? -2 : 0,
            marginBottom: this.props.marginBottom || 0
        };

        return (
            <TouchableOpacity style={[styles.messageBox, extraStyles]} onPress={this.moveToDebugScreen}>
                <Text style={[styles.messageText, styles.header]}>You are in Debug Mode</Text>
                <Text style={[styles.messageText, {marginBottom: 5}]}>
                Expect discrepancies between data on the details screens and notifications that you receive.
                </Text>
                <Text style={styles.messageText}>
                Press this notice to view debug settings.
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    messageBox: {
        backgroundColor: 'orange',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cf9e3e'
    },
    header: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    messageText: {
        color: 'white'
    }
});

const mapStateToProps = (state) => {
    return {
        isDebugging: state.debugging.isDebugging,
        isDebugMsgHidden: state.debugging.isDebugMsgHidden
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        onSetDebugging: (isDebugging) => {
            dispatch(set_debugging(isDebugging))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScaryDebugNotice);