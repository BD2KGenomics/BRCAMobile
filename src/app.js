import {
    Platform, DeviceEventEmitter
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutablejs';
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist-immutable'
import { AsyncStorage } from 'react-native'
import { browsingReducer, subscriptionsReducer, notifylogReducer } from './redux';
import * as Immutable from "immutable";

let reducer = combineReducers({
    browsing: browsingReducer,
    subscribing: subscriptionsReducer,
    notifylog: notifylogReducer
});
let store = createStore(reducer, applyMiddleware(thunk), autoRehydrate());

// redux-persist will save the store to local storage via react-native's AsyncStorage
persistStore(store, {storage: AsyncStorage});

// screen related book keeping
import {registerScreens} from './screens';
registerScreens(store);

// stuff for FCM
import FCM, {
    FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType
} from "react-native-fcm";

import { fetch_fcm_token, receive_fcm_token } from './redux/actions';
import { receive_notification } from "./redux/notifylog/actions";
import {purge_details} from "./redux/browsing/actions";

export default class App {
    constructor() {
        this.startApp();
        this.registerWithFCM();

        this.subscriptions = Immutable.Seq();

        store.subscribe(() => {
            this.subscriptions = store.getState().getIn(['subscribing','subscriptions']).keySeq();
            // console.log("subscribing: ", JSON.stringify(this.subscribing));
        });

        // for buffering notifications (i.e. to show one 'batched' notification if we receive many)
        this.bufferNotifications = this.bufferNotifications.bind(this);
        this.releaseBuffer = this.releaseBuffer.bind(this);
        this.buffered_notifies = [];
        this.buffer_handler = -1;
    }

    startApp() {
        console.log("Starting app");

        Navigation.startSingleScreenApp({
            screen: {
                screen: 'brca.HomeScreen',
                title: 'Home'
            },
            drawer: {
                left: {
                    screen: 'brca.SideMenu'
                }
            }
        });
    }


    // ---------------------------------------
    // --- FCM registration, notification reception
    // ---------------------------------------

    registerWithFCM() {
        FCM.requestPermissions(); // on iOS, prompts for permission to receive push notifications

        // replace with dispatch to fetch token from actions
        store.dispatch(fetch_fcm_token());

        // ensure that we don't have any existing listeners hanging around
        DeviceEventEmitter.removeAllListeners(FCMEvent.Notification);
        DeviceEventEmitter.removeAllListeners(FCMEvent.RefreshToken);

        // set up some handlers for incoming data and control messages
        this.notificationListner = FCM.on(FCMEvent.Notification, this.handleNotification.bind(this));
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, this.handleTokenRefresh.bind(this));

        // subscribe to get variant notices
        // we subscribe to everything and filter out what we don't care about
        FCM.subscribeToTopic('/topics/variant_updates_debug');

        // this is strictly a notification channel
        FCM.subscribeToTopic('/topics/database_updates');

        FCM.getInitialNotification()
            .then(notif => {
                // getInitialNotification() actually gives us the notification that launched us
                if (notif) {
                    console.log("initial notification: ", notif);
                    this.handleNotification(notif);
                }
                else {
                    console.log("no initial notification");
                }
            })
            .catch(error => {
                console.warn("error: ", error.message);
            });
    }

    handleNotification(notif) {
        console.log(`handleNotification() called: (tray?: ${notif.opened_from_tray}, local?: ${notif.local_notification})`);
        console.log("payload: ", notif);

        // ways we can enter this method:
        // 1) we receive a wakeup notification from the OS (android)
        // 2) we receive an actual notification from FCM
        // 3) we receive a notification, raise a "local" notification (to see the message up top), and receive a repeated notification
        // 4) we click the notification (either from cold-start or when the app is running)

        // if the notification has a variant_id, then it's either one from FCM or from the user pressing a notification
        if (notif.hasOwnProperty('variant_id') || notif.hasOwnProperty('announcement')) {
            console.log("* Detected notification with variant_id and/or announcement field");

            if (notif.opened_from_tray) {
                // notif.local_notification is true even if we're coming in from clicking it, apparently
                // so we have to check notif.opened_from_tray first

                let link_target = null;

                if (notif.hasOwnProperty('variant_id')) {
                    link_target = 'updated/' + JSON.stringify({ variant_id: notif.variant_id });
                }
                else if (notif.hasOwnProperty('announcement')) {
                    link_target = 'notifylog/' + JSON.stringify({ version: notif.version });
                }

                if (link_target) {
                    console.log("Opened from tray, launching ", link_target);
                    Navigation.handleDeepLink({
                        link: link_target
                    });
                }


                return;
            }
            else if (notif.local_notification) {
                console.log("* Disregarding self-raised notification");

                // notif.local_notification being true indicates that we raised this event in
                // response to receiving a non-local notification, so we abort

                return;
            }
            else {
                // it's probably from FCM, let's raise a notification if we're actually subscribed to this
                if (this.subscriptions.includes(notif.genome_id)) {
                    console.log("* FCM notification for subscribed variant, raising local notification...");

                    // log the notification
                    store.dispatch(receive_notification(notif));
                    // purge the details cache of this record, if it exists, forcing a remote refresh
                    store.dispatch(purge_details(notif.variant_id));

                    // this.showLocalNotification(notif);
                    this.bufferNotifications(notif);
                }
                else {
                    console.log("(?!) Received notification for unsubscribed variant: ", notif.variant_id)
                }
            }
        }
        else {
            console.log("* Notification without variant_id (OS-raised?): ", notif);
        }

        // if we haven't returned by now, we want to dismiss the note
        if (notif.hasOwnProperty("finish") && typeof notif.finish === "function") {
            notif.finish();
        }
    }

    handleTokenRefresh(token) {
        console.log("TOKEN (refreshUnsubscribe)", token);
        store.dispatch(receive_fcm_token(token));
    }


    // ---------------------------------------
    // --- notification buffering
    // ---------------------------------------

    bufferNotifications(notif) {
        this.buffered_notifies = this.buffered_notifies.concat(notif);

        if (this.buffer_handler >= 0) {
            clearTimeout(this.buffer_handler);
        }

        this.buffer_handler = setTimeout(this.releaseBuffer, 3000);
    }

    releaseBuffer() {
        console.log("Notifies: ", this.buffered_notifies);

        // TODO: fire off either a single detailed notification, or a batched notify if length > 1
        if (this.buffered_notifies.length == 1) {
            this.showLocalNotification(this.buffered_notifies[0]);
        }
        else {
            // TODO: show batched notification
            FCM.presentLocalNotification({
                opened_from_tray: 0,
                icon: "ic_stat_brca_notify",
                title: `${this.buffered_notifies.length} variants have changed`,
                body: `The clinical significance of ${this.buffered_notifies.length} variants have changed`,
                priority: "high",
                variant_count: this.buffered_notifies.length,
                click_action: (Platform.OS === "android") ? "fcm.ACTION.HELLO" : this.buffered_notifies[0].click_action,
                show_in_foreground: true,
                // local: true
            });
        }

        // and clear all this for next time
        this.buffer_handler = -1;
        this.buffered_notifies = [];
    }


    // ---------------------------------------
    // --- actual notification displaying
    // ---------------------------------------

    showLocalNotification(notif) {
        console.log("Showing: ", notif);

        FCM.presentLocalNotification({
            opened_from_tray: 0,
            icon: "ic_stat_brca_notify",
            title: notif.title,
            body: notif.body,
            variant_id: notif.variant_id,
            priority: "high",
            click_action: (Platform.OS === "android") ? "fcm.ACTION.HELLO" : notif.click_action,
            show_in_foreground: true,
            // local: true
        });
    }
}
