import {
    Platform, DeviceEventEmitter
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutablejs';
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist-immutable'
import { AsyncStorage } from 'react-native'
import reducers from './redux/reducers'
import * as Immutable from "immutable";

let reducer = combineReducers({ brca: reducers.brca });
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

export default class App {
    constructor() {
        console.log("Creating app object");

        this.startApp();
        this.registerWithFCM();

        this.subscriptions = Immutable.Seq.Keyed();

        store.subscribe(() => {
            this.subscriptions = store.getState().getIn(['brca','subscriptions']).keySeq();
            console.log("subscriptions: ", JSON.stringify(this.subscriptions));
        });
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

        FCM.getInitialNotification()
            .then(notif => {
                console.log("INITIAL NOTIFICATION", notif);

                // this event is actually when we're connected to FCM, so we can now send subscription requests, etc.

                // finally, subscribe to get variant notices
                // we subscribe to everything and filter out what we don't care about
                // FIXME: verify if we actually need to
                const sub_result = FCM.subscribeToTopic('/topics/variant_updates');
                console.log("subscription result: ", sub_result);

                // getInitialNotification() actually gives us the notification that launched us
                if (notif) {
                    this.handleNotification(notif);
                }
            })
            .catch(error => {
                console.warn("error: ", error.message);
            });
    }

    handleNotification(notif) {
        console.log(`handleNotification() called: (tray?: ${notif.opened_from_tray}, local?: ${notif.local_notification})`);
        console.log(notif);

        // for some reason, this gets called on android, too

        if (notif.opened_from_tray && notif.hasOwnProperty('variant_id')) {
            const target = 'updated/' + JSON.stringify({ variant_id: notif.variant_id });

            console.log("Tray opened, launching ", target);
            Navigation.handleDeepLink({
                link: target
            });

            return;
        }
        else if (notif.local_notification) {
            // notif.local_notification being true indicates that we raised this event in
            // response to receiving a non-local notification, so we abort
            return;
        }

        // TODO: filter notifications to only the one's we've subscribed to
        if (notif.hasOwnProperty('variant_id') && this.subscriptions.includes(parseInt(notif.variant_id))) {
            this.showLocalNotification(notif);
        }
        else {
            console.log("Ignoring ", notif, " because we're not subscribed");
        }

        if (notif.hasOwnProperty("finish") && typeof notif.finish === "function") {
            notif.finish();
        }
    }

    handleTokenRefresh(token) {
        console.log("TOKEN (refreshUnsubscribe)", token);
        store.dispatch(receive_fcm_token(token));
    }

    showLocalNotification(notif) {
        console.log("Showing: ", notif);

        FCM.presentLocalNotification({
            title: notif.title,
            body: notif.body,
            variant_id: notif.variant_id,
            priority: "high",
            click_action: notif.click_action || "fcm.ACTION.HELLO",
            show_in_foreground: true,
            local: true
        });
    }
}
