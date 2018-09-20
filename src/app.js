import {
    Platform, DeviceEventEmitter, AsyncStorage,
    PushNotificationIOS
} from 'react-native';
import { Navigation, NativeEventsReceiver } from 'react-native-navigation';

// redux libs
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import { persistStore, persistCombineReducers, createMigrate } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import storage from 'redux-persist/lib/storage';

// redux reducers and actions
import { generalReducer, browsingReducer, debuggingReducer, subscriptionsReducer, notifylogReducer } from './redux';

// bg task imports
import BackgroundFetch from 'react-native-background-fetch';
import {checkForUpdate, PersistMonitor} from "./background";

// notifications
import PushNotification from 'react-native-push-notification';
import Toast from "react-native-simple-toast";

// ----------------------------------------------------------------------
// --- redux setup
// ----------------------------------------------------------------------

const reducer = persistCombineReducers(
    {
        key: 'brca-exchg',
        version: 2,
        transforms: [immutableTransform()],
        storage,
        debug: true,
        migrate: createMigrate(migrations, { debug: true }),
    },
    {
        general: generalReducer,
        browsing: browsingReducer,
        subscribing: subscriptionsReducer,
        notifylog: notifylogReducer,
        debugging: debuggingReducer
    }
);
const store = createStore(reducer, undefined, applyMiddleware(thunk));
const persistControl = persistStore(store, null);


// ----------------------------------------------------------------------
// --- screen related book keeping (for wix's react-native-navigation)
// ----------------------------------------------------------------------

import {registerScreens} from './screens';
import migrations from "./redux/migrations";
registerScreens(store);


// ----------------------------------------------------------------------
// --- background task handler, with access to the store from above
// ----------------------------------------------------------------------

async function bgTask() {
    console.log('background task initiating');
    console.log("rehydrate starting...");

    new PersistMonitor(persistControl, async () => {
        // we're deferring until the store is actually loaded now
        console.log("rehydrate complete!");

        try {
            await checkForUpdate(store, {
                ignore_backoff: false,
                ignore_older_version: false
            });
        }
        catch(err) {
            console.warn("Error when processing bg task: ", err);
        }
        finally {
            console.log("flushing changes and ending...");
            persistControl.flush();
            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NO_DATA);
        }
    });
}

// this is top-level because headlessjs doesn't actually launch the app
try {
    console.log("Registering bg task...");
    BackgroundFetch.registerHeadlessTask(bgTask);
}
catch (error) {
    console.log("[rn-bg-fetch] registerHeadlessTask error'd: ", error)
}

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
                    // FIXME: debug why the app doesn't launch (or gets stuck for a long time) in certain cases
                    if (appLaunched) {
                        this.initializeApp();
                    }
                    else {
                        new NativeEventsReceiver().appLaunched(this.initializeApp);
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
        const app = this;

        // setup react-native-push-notification's notifications
        PushNotification.configure({
            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
                app.handleNotification(notification);

                // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
                notification.finish(PushNotificationIOS.FetchResult.NewData);
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true,
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
            },
            animationType: 'none'
        });

        // also set up the background task
        BackgroundFetch.configure({
            minimumFetchInterval: 30,
            stopOnTerminate: false,
            startOnBoot: true,
            enableHeadless: true
        }, () => {
            console.log("[rn-bg-fetch] received fetch event");
            bgTask()
                .then((result) => {
                    console.log("[rn-bg-fetch] completed with result: ", result);
                })
                .catch((error) => {
                    console.warn("[rn-bg-fetch] errored out during run: ", error);
                });
        }, (error) => {
            console.warn("[rn-bg-fetch] failed to start: ", error);
        });
    }

    handleNotification(notif) {
        // console.log(`handleNotification() called: (tray?: ${notif.opened_from_tray}, local?: ${notif.local_notification})`);
        console.log("payload: ", notif);

        // logic for dealing with clicking a notification
        if (notif.hasOwnProperty('data')) {
            if (notif.data.type === 'single_notify') {
                Navigation.handleDeepLink({
                    link: 'updated/' + JSON.stringify({ variant_id: notif.data.variant_id })
                });
            }
            else {
                Navigation.handleDeepLink({
                    link: 'notifylog/x' // the second part isn't used
                });
            }
        }

        /*
        let link_target = null;

        if (notif.hasOwnProperty('announcement')) {
            link_target = 'notifylog/' + JSON.stringify({ version: notif.version });
        }
        else if (notif.hasOwnProperty('variant_id')) {
            link_target = 'updated/' + JSON.stringify({ variant_id: notif.variant_id });
        }

        if (link_target) {
            // console.log("Opened from tray, launching ", link_target);
            Navigation.handleDeepLink({
                link: link_target
            });
        }
        */
    }
}
