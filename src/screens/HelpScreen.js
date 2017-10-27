import React, {Component} from 'react';
import {
    Text, Image,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet, Platform, Linking
} from 'react-native';
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';

import LinkableMenuScreen from './LinkableMenuScreen';

export default class HelpScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);
    }

    static navigatorButtons = {
        leftButtons: [{
            icon: (Platform.OS === 'ios') ? require('../../img/navicon_menu.png') : null,
            id: 'sideMenu'
        }]
    };

    static navigatorStyle = {
        drawUnderTabBar: true
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}>How to Use This App</Text>
                <Text style={styles.prose}>
                {`A user guide for this app is under development and will be added here soon.

For more information, visit our website linked below.`}
                </Text>

                <View style={styles.websiteLink}>
                    <Icon.Button
                        style={styles.websiteLinkButton}
                        iconStyle={{marginRight: 5}}
                        name="open-in-browser" backgroundColor="#5ac"
                        onPress={() => Linking.openURL("http://brcaexchange.org")}
                    >
                        <Text style={styles.websiteLinkButtonText}>visit brcaexchange.org</Text>
                    </Icon.Button>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20,
        padding: 20,
        paddingBottom: 0
    },
    prose: {
        lineHeight: 18,
        paddingLeft: 20,
        paddingRight: 20
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop:10,
        color: 'blue'
    },
    websiteLink: {
        alignItems: 'center',
        margin: 20,
        marginTop: 40
    },
    websiteLinkButton: {
        // width: 200
    },
    websiteLinkButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    logo: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center'
    },
    tokenText: {
        fontSize: 10,
        color: '#eee'
    }
});

/*
const mapStateToProps = (state_immutable) => {
    return {};
};

export default connect(
    mapStateToProps
)(HelpScreen);
*/