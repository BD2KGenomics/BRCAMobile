import React, {Component} from 'react';
import {
    Text, Image, View, ScrollView,
    TouchableOpacity,
    StyleSheet,
    AlertIOS
} from 'react-native';

// import VersionNumber from 'react-native-version-number';

import BaseSideMenu from './BaseSideMenu';
import SidebarMenuItems from "../components/SidebarMenuItems";

export default class SideMenu extends BaseSideMenu {
    constructor(props) {
        super(props);
    }

    render() {
        const navbuttonProps = {
            size: 30,
            width: 300,
            color: "#eee",
            padding: 15,
            paddingLeft: 20,
            borderRadius: 0,
            backgroundColor: "transparent",
            underlayColor: "#555"
        };

        return (
            <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>BRCA Exchange</Text>
                </View>

                <View style={{flex: 1}}>
                    <SidebarMenuItems
                        onNavigateRequest={this.navigateTo}
                        buttonStyle={styles.button}
                        navbuttonProps={navbuttonProps}
                    />
                </View>

                <Text style={styles.version}>brca-exchange mobile v1.3</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        opacity: 1,
        backgroundColor: '#555',
        alignItems: 'flex-start',
        // backgroundColor: 'white',
        justifyContent: 'flex-start',
        width: 300
    },
    titleBar: {
        padding: 19,
        width: 300,
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        color: 'white',
        fontWeight: '500'
    },
    button: {
        textAlign: 'left',
        fontSize: 18,
        color: '#eee',
        fontWeight: '300'
    },
    version: {
        flex: 0,
        width: 260,
        borderTopColor: '#777',
        borderTopWidth: 1,
        paddingTop: 10,
        marginBottom: 20,
        color: '#888',
        fontSize: 15,
        textAlign: 'center'
    }
});
