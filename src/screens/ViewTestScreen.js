import React, {Component} from 'react';
import {
    Text, Image,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import LinkableMenuScreen from './LinkableMenuScreen';

export default class ViewTestScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);
    }

    static navigatorButtons = {
        leftButtons: [{
            icon: require('../../img/navicon_menu.png'),
            id: 'sideMenu'
        }]
    };

    static navigatorStyle = {
        drawUnderTabBar: true
    };

    render() {
        return (
            <View>
                <View style={{flexDirection: 'row', height: 100, padding: 20}}>
                    <View style={{backgroundColor: 'blue', flex: 0.3}} />
                    <View style={{backgroundColor: 'red', flex: 0.5}} />
                    <Text>Hello World!</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20,
    },
    prose: {
        lineHeight: 18
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop:10,
        color: 'blue'
    },
    logo: {
        marginTop: 30,
        marginBottom: 40,
        // alignItems: 'center',
    }
});
