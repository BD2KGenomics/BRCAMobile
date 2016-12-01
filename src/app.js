import {
    Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import {AsyncStorage} from 'react-native'
import reducers from './redux/reducers'

let reducer = combineReducers({ brca: reducers.brca });
// applyMiddleware supercharges createStore with middleware:
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
