import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Text, TextInput, View, ScrollView, ListView, Image, TouchableOpacity, TouchableHighlight, StyleSheet,
    Alert, Platform, Dimensions
} from 'react-native';
import groupBy from 'lodash/groupBy';
import { connect } from "react-redux";
import { Navigation } from 'react-native-navigation';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScrollTopView from 'react-native-scrolltotop';

import LinkableMenuScreen from './LinkableMenuScreen';
import {mark_notification_read, mark_visible_read, archive_all_notifications} from "../redux/notifylog/actions";

class NotifyLogScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);

        this.state = {
            notifyDS: this.createDataSource(props.notifications),
            isNotAtTop: false
        };

        this.renderRow = this.renderRow.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);

        this.markAllRead = this.markAllRead.bind(this);
        this.archiveAllNotifications = this.archiveAllNotifications.bind(this);
        this.showRead = this.showUnreadOrRead.bind(this, true);
        this.showUnread = this.showUnreadOrRead.bind(this, false);
    }

    static propTypes = {
        showRead: PropTypes.bool.isRequired
    };

    static defaultProps = {
        showRead: false
    };

    static navigatorButtons = {
        leftButtons: [{
            icon: (Platform.OS === 'ios') ? require('../../img/navicon_menu.png') : null,
            id: 'sideMenu'
        }]
    };

    showUnreadOrRead(showRead) {
        if (showRead) {
            this.props.navigator.push({
                title: "Notify Log (Read)",
                screen: "brca.NotifyLogScreen",
                passProps: {
                    showRead: true
                }
            });
        }
        else {
            this.props.navigator.pop();
        }
    }

    markAllRead() {
        // somehow dispatch updates to all the things we're viewing to be read
        if (this.state.notifyDS.getRowCount() > 0) {
            Alert.alert(
                'Mark Notifications as Read',
                'Mark all notifications in this list as read?',
                [
                    {text: 'Cancel'},
                    {
                        text: 'OK', onPress: () => {
                            this.props.markVisibleRead();
                            Toast.show("Notifications marked read");
                        }
                    },
                ]
            );
        }
    }

    archiveAllNotifications() {
        if (this.state.notifyDS.getRowCount() > 0) {
            Alert.alert(
                'Archive All Notifications',
                'Archive all notifications, so they no longer appear in this list?',
                [
                    {text: 'Cancel'},
                    {
                        text: 'OK', onPress: () => {
                            this.props.archiveAllNotifications();
                            Toast.show("Notifications archived");
                        }
                    },
                ]
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.notifications != this.props.notifications) {
            this.setState({
                notifyDS: this.createDataSource(nextProps.notifications)
            });
        }
    }

    createDataSource(notifications, showRead) {
        const reversedNotifies = notifications.filter(x => !x.archived).reverse();
        const groupedNotifies = groupBy(reversedNotifies, x => x.version || "(unknown)");

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1.version !== s2.version
        });

        const sectionIDs = Object.keys(groupedNotifies).reverse();

        return ds.cloneWithRowsAndSections(groupedNotifies, sectionIDs);
    }

    renderSectionHeader(h, hID) {
        return (
            <View style={styles.sectionRow}>
                <Text style={styles.sectionRowText}>Updates for Version {hID} ({`${h.length} entr${h.length == 1 ? 'y' : 'ies'}`})</Text>
            </View>
        );
    }

    renderRow(d) {
        return (
            <TouchableOpacity onPress={this.rowClicked.bind(this, d)}>
                <View style={[styles.row, styles.contentRow]}>
                    <View style={{flexGrow: 1, width: 0.9}}>
                        <Text style={styles.rowTitle}>{d.title}</Text>
                        { d.received_at && <Text style={styles.rowDate}>{d.received_at.toLocaleString()}</Text> }
                        <Text style={styles.rowSubtitle}>{d.body}</Text>
                    </View>

                    <Icon
                        name="fiber-manual-record" size={16}
                        color={ !d.read ? "#1D9BF6" : "#aaa" }
                        style={{alignSelf: 'center', paddingLeft: 10}}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    rowClicked(d) {
        this.props.markNotificationRead(d.idx);

        Navigation.handleDeepLink({
            link: 'updated/' + JSON.stringify({ variant_id: d.variant_id })
        });
    }

    render() {
        const targetDS = this.state.notifyDS;
        const hasUnreviewedNotifies = targetDS.getRowCount() > 0;

        return (
            <ScrollView style={{flex: 1, padding: 0, backgroundColor: 'white'}}>
                <View style={styles.row}>
                    {
                        !this.props.showRead
                        ? (
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{flexGrow: 1}}>
                                    <Icon.Button name="close"
                                        backgroundColor={ hasUnreviewedNotifies ? "#007AFF" : "#aaa" }
                                        onPress={this.markAllRead}>
                                        <Text style={styles.clearButtonText}>Mark as Read</Text>
                                    </Icon.Button>
                                </View>

                                <View style={{flexGrow: 1, marginLeft: 10}}>
                                    <Icon.Button name="archive" backgroundColor={ hasUnreviewedNotifies ? "#c5c" : "#aaa" }
                                        onPress={this.archiveAllNotifications}>
                                        <Text style={styles.clearButtonText}>Archive</Text>
                                    </Icon.Button>
                                </View>
                            </View>
                        )
                        : (
                            <Icon.Button name="arrow-back" backgroundColor="#007AFF" onPress={this.showUnread}>
                                <Text style={styles.clearButtonText}>Return to Unread Notifications</Text>
                            </Icon.Button>
                        )
                    }

                </View>

                <ListView
                    style={styles.listContainer}
                    enableEmptySections={true}
                    dataSource={ targetDS }
                    renderRow={this.renderRow}
                    renderSectionHeader={this.renderSectionHeader}
                />

                {
                    !hasUnreviewedNotifies
                        ? (
                            <View style={styles.row}>
                                <Text style={styles.emptySectionText}>no {this.props.showRead ? "read" : "unread"} notifications</Text>
                            </View>
                        )
                        : null
                }

                { /* this.props.showRead ? null : (
                    <View style={styles.row}>
                        <Icon.Button name="more-horiz" backgroundColor="#5a5" onPress={this.showRead}>
                            <Text style={styles.clearButtonText}>See Reviewed Notifications</Text>
                        </Icon.Button>
                    </View>
                ) */ }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    sectionRow: {
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#777',
    },
    sectionRowText: {
        color: 'white',
        fontWeight: 'bold'
    },
    emptySectionText: {
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#555'
    },
    row: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    contentRow: {
        flex: 1,
        flexDirection: 'row'
    },
    rowTitle: {
        fontWeight: 'bold', marginBottom: 2
    },
    rowDate: {
        fontSize: 12,
        margin: 3,
        color: '#333'
    },
    rowSubtitle: {

    },
    controlFrame: {
        padding: 20
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});

/* define the component-to-store connectors */

const mapStateToProps = (state_immutable) => {
    const state = state_immutable.toJS();

    return {
        // subscription info
        notifications: state.notifylog.notifications
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        markVisibleRead: () => {
            dispatch(mark_visible_read());
        },
        markNotificationRead: (idx) => {
            dispatch(mark_notification_read(idx));
        },
        archiveAllNotifications: () => {
            dispatch(archive_all_notifications());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotifyLogScreen);
