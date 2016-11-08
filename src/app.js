import {
  Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';

// screen related book keeping
import {registerScreens} from './screens';
registerScreens();

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
