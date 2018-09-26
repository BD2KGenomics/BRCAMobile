import React from 'react';
import {
    Text, View,
    StyleSheet,
    SafeAreaView
} from 'react-native';

import BaseSideMenu from './BaseSideMenu';
import SidebarMenuItems from "../components/SidebarMenuItems";
import VersionBlurb from "../components/VersionBlurb";

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
            <SafeAreaView style={{flex: 1, backgroundColor: '#555' }}>
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

                    <VersionBlurb />
                </View>
            </SafeAreaView>
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
        padding: 9,
        paddingLeft: 19,
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
