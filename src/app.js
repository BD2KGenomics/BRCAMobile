import {
    Platform, DeviceEventEmitter
} from 'react-native';
import { Navigation, NativeEventsReceiver } from 'react-native-navigation';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutablejs';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist-immutable';
import { AsyncStorage } from 'react-native';
import { browsingReducer, debuggingReducer, subscriptionsReducer, notifylogReducer } from './redux';
import * as Immutable from "immutable";
import BackgroundTask from 'react-native-background-task';
import {checkForUpdate} from "./background";

import { fetch_fcm_token, receive_fcm_token } from './redux/actions';

// stuff for FCM
import FCM, {
    FCMEvent
} from "react-native-fcm";


// ----------------------------------------------------------------------
// --- redux setup
// ----------------------------------------------------------------------

const reducer = combineReducers({
    browsing: browsingReducer,
    subscribing: subscriptionsReducer,
    notifylog: notifylogReducer,
    debugging: debuggingReducer
});
const store = createStore(reducer, applyMiddleware(thunk), autoRehydrate());
const persistControl = persistStore(store, {storage: AsyncStorage });


// ----------------------------------------------------------------------
// --- screen related book keeping (for wix's react-native-navigation)
// ----------------------------------------------------------------------

import {registerScreens} from './screens';
registerScreens(store);


// ----------------------------------------------------------------------
// --- background task handler, with access to the store from above
// ----------------------------------------------------------------------

async function bgTask() {
    console.log('Hello from a background task');
    await checkForUpdate(store, {
        ignore_backoff: false,
        ignore_older_version: false
    });
    BackgroundTask.finish();
}

// attach background task
BackgroundTask.define(bgTask);

// this is used in NotifyLog to allow the user to manually launch a refresh task
// FIXME: consider making firing the background task a reducer action, so we don't need to send the store over?
export {store, persistControl};


// ----------------------------------------------------------------------
// --- application entrypoint
// ----------------------------------------------------------------------

export default class App {
    constructor() {
        // ensure even when passed as a reference that we retain the 'this'
        this.initializeApp = this.initializeApp.bind(this);

        // only launch once we receive AppLaunched (on android)
        if (Platform.OS === 'android') {
            Promise.resolve(Navigation.isAppLaunched())
                .then(appLaunched => {
                    if (appLaunched) {
                        this.initializeApp();
                    } else {
                        new NativeEventsReceiver().appLaunched(this.initializeApp);
                        // App hasn't been launched yet -> show the UI only when needed.
                    }
                });
        }
        else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // a preamble to startApp()
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

        BackgroundTask.cancel();
        BackgroundTask.schedule({
            period: 900
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
        FCM.subscribeToTopic('/topics/TEST_variant_updates_debug_TEST');

        // this is strictly a notification channel
        FCM.subscribeToTopic('/topics/TEST_database_updates_TEST');

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

        // logic for dealing with clicking a notification
        if (notif.opened_from_tray) {
            // notif.local_notification is true even if we're coming in from clicking it, apparently
            // so we have to check notif.opened_from_tray first

            let link_target = null;

            if (notif.hasOwnProperty('announcement')) {
                link_target = 'notifylog/' + JSON.stringify({ version: notif.version });
            }
            else if (notif.hasOwnProperty('variant_id')) {
                link_target = 'updated/' + JSON.stringify({ variant_id: notif.variant_id });
            }

            if (link_target) {
                console.log("Opened from tray, launching ", link_target);
                Navigation.handleDeepLink({
                    link: link_target
                });
            }

            return;
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
