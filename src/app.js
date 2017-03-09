import {
    Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutablejs';
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist-immutable'
import {AsyncStorage} from 'react-native'
import reducers from './redux/reducers'

let reducer = combineReducers({ brca: reducers.brca });
let store = createStore(reducer, applyMiddleware(thunk), autoRehydrate());

// redux-persist will save the store to local storage via react-native's AsyncStorage
persistStore(store, {storage: AsyncStorage});

// screen related book keeping
import {registerScreens} from './screens';
registerScreens(store);

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
