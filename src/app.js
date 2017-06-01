import {
    Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutablejs';
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist-immutable'
import { AsyncStorage } from 'react-native'
import reducers from './redux/reducers'

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
        this.startApp();
        this.registerWithFCM();
    }

    startApp() {
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

        FCM.getInitialNotification().then(notif => {
            console.log("INITIAL NOTIFICATION", notif);

            // this event is actually when we're connected to FCM, so we can now send subscription requests, etc.

            // finally, subscribe to get variant notices
            // we subscribe to everything and filter out what we don't care about
            // FIXME: verify if we actually need to
            const sub_result = FCM.subscribeToTopic('/topics/variant_updates');
            console.log("subscription result: ", sub_result);
        });

        // set up some handlers for incoming data and control messages
        this.notificationListner = FCM.on(FCMEvent.Notification, this.handleNotification.bind(this));
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, this.handleTokenRefresh.bind(this));
    }

    handleNotification(notif) {
        console.log("Notification", notif);

        if (notif.local_notification) {
            return;
        }

        if(notif.opened_from_tray) {
            return;
        }

        if (Platform.OS ==='ios') {
            //optional

            // iOS requires developers to call completionHandler to end notification process. If you do not call it your background
            // remote notifications could be throttled, to read more about it see the above documentation link.

            // This library handles it for you automatically with default behavior (for remote notification, finish with NoData;
            // for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the
            // following code to override
            // notif._notificationType is available for iOS platfrom
            switch (notif._notificationType) {
                case NotificationType.Remote:
                    notif.finish(RemoteNotificationResult.NewData);
                    //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                    break;

                case NotificationType.NotificationResponse:
                    notif.finish();
                    break;

                case NotificationType.WillPresent:
                    notif.finish(WillPresentNotificationResult.All);
                    //other types available: WillPresentNotificationResult.None
                    break;
            }
        }

        this.showLocalNotification(notif);
    }

    handleTokenRefresh(token) {
        console.log("TOKEN (refreshUnsubscribe)", token);
        store.dispatch(receive_fcm_token(token));
    }

    showLocalNotification(notif) {
        FCM.presentLocalNotification({
            title: notif.title,
            body: notif.body,
            priority: "high",
            click_action: notif.click_action,
            show_in_foreground: true,
            local: true
        });
    }
}
