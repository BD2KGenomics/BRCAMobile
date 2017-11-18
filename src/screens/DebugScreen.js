import React, {Component} from 'react';
import {
    Text, Image, Alert,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet, Platform, Linking
} from 'react-native';
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import SettingsList from 'react-native-settings-list';


import LinkableMenuScreen from './LinkableMenuScreen';
import {
    set_debug_msg_hidden, set_debugging, set_notify_shows_version, set_orange_header_hidden, set_quick_refresh,
    set_refresh_mocked
} from "../redux/debugging/actions";

import {persistControl} from "../app";
import {debug_purge_notifystate, set_nextcheck_time} from "../redux/notifylog/actions";

class DebugScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);

        this.purgeReduxState = this.purgeReduxState.bind(this);
        this.purgeNotifyState = this.purgeNotifyState.bind(this);
        this.disableDevMode = this.disableDevMode.bind(this);
        this.toggleQuickRefresh = this.toggleQuickRefresh.bind(this);
        this.toggleDebugMessage = this.toggleDebugMessage.bind(this);
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

    purgeReduxState() {
        const confirmed = () => {
            // persistControl.flush();

            persistControl.purge().then(() => {
                this.props.navigator.resetTo({
                    title: "Home",
                    screen: "brca.HomeScreen",
                    animated: true
                });

                Toast.show("Store purged");
            });
        };

        Alert.alert(
            'Purge Redux Store',
            'Wipe all local data from the redux store?\n\nThis will clear your subscriptions, notifies, cached data, etc.',
            [ {text: 'Cancel'}, { text: 'OK', onPress: confirmed } ]
        );
    }

    purgeNotifyState() {
        const confirmed = () => {
            this.props.onDebugPurgeNotifyState();
        };

        Alert.alert(
            'Reset Notify State',
            'Reset all background task state and notifications?',
            [ {text: 'Cancel'}, { text: 'OK', onPress: confirmed } ]
        );
    }

    disableDevMode() {
        const confirmed = () => {
            // purge the notify state since they may have been hitting the mock server
            this.props.onDebugPurgeNotifyState();

            this.props.onSetDebugging(false);

            this.props.navigator.resetTo({
                title: "Home",
                screen: "brca.HomeScreen",
                animated: true
            });

            Toast.show("Dev mode disabled");
        };

        Alert.alert(
            'Disable Dev Mode',
            'Disable developer mode?\n\nThis will also purge your notification data, since it may have come from the mock server.\n\nYou can re-enable dev mode later via the secret sequence.',
            [ {text: 'Cancel'}, {text: 'OK', onPress: confirmed} ]
        );
    }

    toggleQuickRefresh() {
        const newValue = !this.props.isQuickRefreshing;

        // persist that value
        this.props.onSetQuickRefresh(newValue);

        // if we're enabling, reset our refresh timer
        if (newValue) {
            this.props.onSetNextcheckTime(null);
            Toast.show("Backoff timer reset");
        }
    }

    toggleDebugMessage() {
        if (!this.props.isDebugMsgHidden) {
            Alert.alert(
                'Hide Debug Notice',
                'Hide the giant orange debug notice? Note that you will remain in debug mode, just with the notice hidden.',
                [ {text: 'Cancel'}, {text: 'OK', onPress: () => { this.props.onSetDebugMsgHidden(true); }} ]
            );
        }
        else {
            this.props.onSetDebugMsgHidden(false);
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <SettingsList borderColor='#ccc'>
                    <SettingsList.Header
                        headerText="General"
                        headerStyle={styles.settingsHeader}
                    />
                    <SettingsList.Item
                        hasNavArrow={true}
                        onPress={this.disableDevMode}
                        title='Exit Developer Mode'
                    />

                    <SettingsList.Header
                        headerText="Background Task Options"
                        headerStyle={styles.settingsHeader}
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        switchState={this.props.isRefreshMocked}
                        switchOnValueChange={() => { this.props.onSetRefreshMocked(!this.props.isRefreshMocked); }}
                        hasSwitch={true}
                        title='Mock Refresh Server'
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        switchState={this.props.isQuickRefreshing}
                        switchOnValueChange={this.toggleQuickRefresh}
                        hasSwitch={true}
                        title='Quicker Refresh Interval'
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        switchState={this.props.showsVersionInNotify}
                        switchOnValueChange={() => { this.props.onSetNotifyShowsVersion(!this.props.showsVersionInNotify); }}
                        hasSwitch={true}
                        title='Show Version in Notify Title'
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Target Host'
                        titleInfo={(this.props.isDebugging && this.props.isRefreshMocked) ? "40.78.27.48:8500" : "brcaexchange.org"}
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Last Updated At'
                        // icon={<View style={styles.imageStyle}><Icon name="timelapse" size={32} /></View>}
                        titleInfo={`${this.props.updatedAt ? this.props.updatedAt.toLocaleString() : 'never'}`}
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Latest Release'
                        titleInfo={`${this.props.latestVersion ? `release ${this.props.latestVersion}` : 'none'}`}
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Next Full Check'
                        titleInfo={`${this.props.nextCheck ? (new Date(this.props.nextCheck)).toLocaleString() : 'never'}`}
                    />
                    <SettingsList.Item
                        hasNavArrow={true}
                        onPress={this.purgeNotifyState}
                        title='Reset Notify State'
                    />

                    <SettingsList.Header
                        headerText="Nuclear Options"
                        headerStyle={styles.settingsHeader}
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        switchState={this.props.isDebugMsgHidden}
                        switchOnValueChange={this.toggleDebugMessage}
                        hasSwitch={true}
                        title='Hide Debug Notice'
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        switchState={this.props.isOrangeHeaderHidden}
                        switchOnValueChange={() => this.props.onSetOrangeHeaderHidden(!this.props.isOrangeHeaderHidden)}
                        hasSwitch={true}
                        title='Hide Orange Dev Header'
                    />
                    <SettingsList.Item
                        hasNavArrow={true}
                        onPress={this.purgeReduxState}
                        title='Purge Redux State'
                    />
                </SettingsList>

                <View style={{paddingTop: 5, paddingLeft: 10}}>
                    <Text style={styles.settingsHeader}>Misc. Debug Information</Text>
                </View>

                <View style={styles.blurbHolder}>
                    <Text style={[styles.prose, {fontWeight:'bold'}]}>
                    FCM Token:
                    </Text>
                    <Text style={styles.prose} selectable={true}>
                    { this.props.fcm_token || "no token" }
                    </Text>
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
    settingsHeader: {
        color: '#555', fontSize: 18, fontWeight: 'bold',
        paddingTop: 30, paddingLeft: 10, paddingBottom: 5
    },
    prose: {
        lineHeight: 18,
        paddingLeft: 20,
        paddingRight: 20
    },
    tokenText: {
        fontSize: 10,
        color: '#eee'
    },
    blurbHolder: {
        padding: 20
    },
    imageStyle:{
        marginLeft:15,
        alignSelf:'center',
        justifyContent:'center'
    }
});

const mapStateToProps = (state) => {
    return {
        fcm_token: state.subscribing.token,
        isDebugging: state.debugging.isDebugging,
        isDebugMsgHidden: state.debugging.isDebugMsgHidden,
        isOrangeHeaderHidden: state.debugging.isOrangeHeaderHidden,
        isRefreshMocked: state.debugging.isRefreshMocked,
        isQuickRefreshing: state.debugging.isQuickRefreshing,
        showsVersionInNotify: state.debugging.showsVersionInNotify,
        nextCheck:  state.notifylog.nextCheck, // min time to check for a new release, in milliseconds since the epoch
        latestVersion:  state.notifylog.latestVersion, // database version since last successful fetch
        updatedAt:  state.notifylog.updatedAt, // the time that we completed the update
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSetDebugging: (isDebugging) => {
            dispatch(set_debugging(isDebugging))
        },
        onSetDebugMsgHidden: (isDebugMsgHidden) => {
            dispatch(set_debug_msg_hidden(isDebugMsgHidden))
        },
        onSetOrangeHeaderHidden: (isOrangeHeaderHidden) => {
            dispatch(set_orange_header_hidden(isOrangeHeaderHidden))
        },
        onSetRefreshMocked: (isRefreshMocked) => {
            dispatch(set_refresh_mocked(isRefreshMocked))
        },
        onSetQuickRefresh: (isQuickRefreshing) => {
            dispatch(set_quick_refresh(isQuickRefreshing))
        },
        onSetNotifyShowsVersion: (showsVersionInNotify) => {
            dispatch(set_notify_shows_version(showsVersionInNotify))
        },
        onSetNextcheckTime: (nextCheck) => {
            dispatch(set_nextcheck_time(nextCheck));
        },
        onDebugPurgeNotifyState: () => {
            dispatch(debug_purge_notifystate())
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebugScreen);
