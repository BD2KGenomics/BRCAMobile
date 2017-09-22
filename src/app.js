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

import { fetch_fcm_token, receive_fcm_token } from './redux/actions';
import {observe_notification, receive_notification} from "./redux/notifylog/actions";

// stuff for FCM
import FCM, {
    FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType
} from "react-native-fcm";

let reducer = combineReducers({
    browsing: browsingReducer,
    subscribing: subscriptionsReducer,
    notifylog: notifylogReducer
});
let store = createStore(reducer, applyMiddleware(thunk), autoRehydrate());

// deals with the fact that the store takes a while to become available, so we need to buffer push notifications
// until it's up and ready to properly receive them
let store_loaded = false;
const notify_buffer = [];

// redux-persist will save the store to local storage via react-native's AsyncStorage
persistStore(store, {storage: AsyncStorage}, () => {
    console.log("*** rehydration complete! ***");
    store_loaded = true;

    // now that we've loaded, dispatch all the pending notifies
    if (notify_buffer.length > 0) {
        console.log(`[!!] processing ${notify_buffer.length} queued notification(s)...`);
        notify_buffer.forEach(notif => {
            store.dispatch(observe_notification(notif));
        })
    }
});

// screen related book keeping
import {registerScreens} from './screens';
registerScreens(store);

export default class App {
    constructor() {
        this.startApp();
        this.registerWithFCM();
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
            },
            animationType: 'none'
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
        // FIXME: switch this back to the 'production' topic
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

                // notif.local_notification being true indicates that we raised this event ourselves
                // FIXME: verify that local_notification only comes from us

                return;
            }
            else {
                if (!store_loaded) {
                    console.log("[?!] Store not yet loaded, deferring handling...");
                    notify_buffer.push(notif);
                }
                else {
                    // simply pass this off to the notifylog reducer
                    store.dispatch(observe_notification(notif));
                }
            }
        }
        else {
            console.log("* Notification without variant_id/announcement (OS-raised?): ", notif);

            if (notif.opened_from_tray && notif.from === '/topics/database_updates') {
                Navigation.handleDeepLink({
                    link: 'notifylog/' + JSON.stringify({ version: notif.version })
                });
            }
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
}
