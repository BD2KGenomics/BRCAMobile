import {
    Platform, DeviceEventEmitter, AsyncStorage
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
import BackgroundTask from 'react-native-background-task';
import {checkForUpdate, PersistMonitor} from "./background";


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
            BackgroundTask.finish();
        }
    });
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

        // FIXME: check if we need to handle an initial notification
        // (we probably need to see how the new local notify lib launches the app)
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
}
