import {
  Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import * as reducers from './reducers'

let reducer = combineReducers(reducers);
// applyMiddleware supercharges createStore with middleware:
let store = createStore(reducer, applyMiddleware(thunk));

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
