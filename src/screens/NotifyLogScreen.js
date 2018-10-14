import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Text, TextInput, View, ScrollView, ListView, Image, TouchableOpacity, TouchableHighlight, StyleSheet,
    Alert, Platform, Dimensions, RefreshControl, SectionList
} from 'react-native';
import groupBy from 'lodash/groupBy';
import { connect } from "react-redux";
import { Navigation } from 'react-native-navigation';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScrollTopView from '../components/3rdparty/ScrollTopView';
import {checkForUpdate} from "../background";
import {store} from "../app";

import LinkableMenuScreen from './LinkableMenuScreen';
import {
    mark_notification_read, mark_visible_read, archive_all_notifications,
    clear_all_notifications
} from "../redux/notifylog/actions";
import ScaryDebugNotice from "../components/ScaryDebugNotice";
import {ensureNonImmutable, makeCancelable} from "../toolbox/misc";
import {defaultNavButtons} from "./BaseSideMenu";

class NotifyLogScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);

        this.state = {
            isNotAtTop: false,
            refreshing: false
        };

        this.renderRow = this.renderRow.bind(this);
        this.renderEmptyRow = this.renderEmptyRow.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);

        this.markAllRead = this.markAllRead.bind(this);
        this.archiveAllNotifications = this.archiveAllNotifications.bind(this);
        this.showRead = this.showUnreadOrRead.bind(this, true);
        this.showUnread = this.showUnreadOrRead.bind(this, false);

        this.refreshNotifies = this.refreshNotifies.bind(this);
    }

    componentWillUnmount() {
        // cancel the cancellable promise, if it exists
        if (this.refreshPromise) {
            this.refreshPromise.cancel();
        }
    }

    static propTypes = {
        showRead: PropTypes.bool.isRequired
    };

    static defaultProps = {
        showRead: false
    };

    static navigatorButtons = defaultNavButtons;

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
        if (this.props.notifications.filter(x => !x.read).size > 0) {
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
        if (this.props.notifications.size > 0) {
            Alert.alert(
                'Archive All Notifications',
                'Archive all notifications, so they no longer appear in this list?',
                [
                    {text: 'Cancel'},
                    {
                        text: 'OK', onPress: () => {
                            this.props.clearAllNotifications();
                            Toast.show("Notifications archived");
                        }
                    },
                ]
            );
        }
    }

    _aggNotifies(notifications) {
        // convert notifications to a js object if it isn't one already
        const notifies_js = ensureNonImmutable(notifications);

        const reversedNotifies = notifies_js.filter(x => !x.archived).reverse();
        const groupedNotifies = groupBy(reversedNotifies, x => x.version || "(unknown)");

        return Object.keys(groupedNotifies).reverse().map(k => {
            return {
                data: groupedNotifies[k].map(x => ({ key: x.idx, ...x})),
                version: k
            }
        });
    }

    renderSectionHeader({ section }) {
        const entryCount = section.data.length;
        return (
            <View style={styles.sectionRow}>
                <Text style={styles.sectionRowText}>
                Updates for Version {section.version} ({`${entryCount} entr${entryCount == 1 ? 'y' : 'ies'}`})
                </Text>
            </View>
        );
    }

    renderRow({ item: d }) {
        return (
            <TouchableOpacity onPress={this.rowClicked.bind(this, d)}>
                <View style={[styles.row, styles.contentRow]}>
                    <View style={{flexGrow: 1, width: 0.9}}>
                        <Text style={styles.rowTitle}>{d.title}</Text>
                        <Text style={styles.rowSubtitle}>{d.body}</Text>
                        { d.received_at && <Text style={styles.rowDate}>received at {d.received_at.toLocaleString()}</Text> }
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

    renderEmptyRow() {
        return (
            <View style={[styles.row, styles.emptyResultsRow]}>
                <Text style={styles.emptySectionText}>
                {
                `no current notifications\n` +
                `last updated: ${this.props.updatedAt ? this.props.updatedAt.toLocaleString() : 'never'}\n` +
                `latest release: ${this.props.latestVersion || 'none'}\n` +
                `pull down to refresh`
                }
                </Text>
            </View>
        );
    }

    rowClicked(d) {
        this.props.markNotificationRead(d.idx);

        Navigation.handleDeepLink({
            link: 'updated/' + JSON.stringify({ variant_id: d.variant_id })
        });
    }

    refreshNotifies() {
        this.setState({
            refreshing: true
        });

        // run the background task
        const config = {
            ignore_backoff: true, // allows us to refresh even if we're not in the refresh interval
            ignore_older_version: false, // would allow us to refresh even if we previously got the latest version
            all_subscribed: false // treats every variant as if we're subscribed to it (produces a lot of results...)
        };

        this.refreshPromise = makeCancelable(
            checkForUpdate(store, config)
                .then(result => {
                    Toast.show(result);
                })
                .catch((err) => {
                    console.log(err);
                    Toast.show(`ERROR: ${err.message}`);
                })
        );

        // splitting the promise here allows us to cancel the component-related updates that occur when
        // the background task completes, which would otherwise throw an error if the component was unmounted

        this.refreshPromise
            .promise
            .then(() => {
                this.setState({
                    refreshing: false
                });
            })
            .catch(() => {
                console.log("NotifyLog bg task completion promise cancelled")
            }) // ignore the cancelling rejection
    }

    render() {
        let groupedNotifies = this._aggNotifies(this.props.notifications);
        const hasNotifies = groupedNotifies.length > 0;
        const hasUnreadNotifies = hasNotifies && groupedNotifies.some(sec => sec.data.some(item => !item.read));

        if (groupedNotifies.length == 0) {
            groupedNotifies = [{
                data: [{key: 0, emptyList: true}], renderItem: this.renderEmptyRow, version: -1
            }];
        }

        return (
            <View style={{flex: 1, padding: 0, backgroundColor: 'white'}}>
                <View style={[styles.row,{height: 75}]}>
                    {
                        !this.props.showRead
                        ? (
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{flexGrow: 1}}>
                                    <Icon.Button name="close"
                                        backgroundColor={ hasUnreadNotifies ? "#007AFF" : "#aaa" }
                                        onPress={this.markAllRead}>
                                        <Text style={styles.clearButtonText}>Mark as Read</Text>
                                    </Icon.Button>
                                </View>

                                <View style={{flexGrow: 1, marginLeft: 10}}>
                                    <Icon.Button name="archive" backgroundColor={ hasNotifies ? "#c5c" : "#aaa" }
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

                <ScaryDebugNotice negPadding={2} marginBottom={-2} />

                <SectionList
                    ref="listview"
                    style={styles.listContainer}
                    sections={groupedNotifies}
                    renderItem={this.renderRow}
                    renderSectionHeader={hasNotifies ? this.renderSectionHeader : null}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.refreshNotifies}
                        />
                    }
                    onScroll={this._onScroll.bind(this)}
                />

                { this.state.isNotAtTop ?
                    <ScrollTopView root={this}
                        onPress={() => this.refs.listview.scrollToLocation({ sectionIndex: -1, itemIndex: -1 })}
                        top={Dimensions.get('window').height - 160}
                        left={Dimensions.get('window').width - 80} /> : null
                }
            </View>
        );
    }

    _onScroll(e) {
        this.setState({
            isNotAtTop: (e.nativeEvent.contentOffset.y > 100)
        });
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
    emptyResultsRow: {
        borderTopWidth: 0.5,
        borderTopColor: '#ccc'
    },
    contentRow: {
        flex: 1,
        flexDirection: 'row'
    },
    rowTitle: {
        fontWeight: 'bold', marginBottom: 6
    },
    rowDate: {
        fontSize: 12,
        marginTop: 6,
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

const mapStateToProps = (state) => {
    const state_notifylog = state.notifylog;

    return {
        // subscription info
        notifications: state_notifylog.notifications,
        updatedAt: state_notifylog.updatedAt,
        latestVersion: state_notifylog.latestVersion
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
        },
        clearAllNotifications: () => {
            dispatch(clear_all_notifications());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotifyLogScreen);
