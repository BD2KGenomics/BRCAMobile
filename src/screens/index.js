import {Navigation} from 'react-native-navigation';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import AboutScreen from './AboutScreen';
import DetailScreen from './DetailScreen';
import SideMenu from './SideMenu';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('brca.HomeScreen', () => HomeScreen);
  Navigation.registerComponent('brca.SearchScreen', () => SearchScreen);
  Navigation.registerComponent('brca.AboutScreen', () => AboutScreen);
  Navigation.registerComponent('brca.DetailScreen', () => DetailScreen);
  Navigation.registerComponent('brca.SideMenu', () => SideMenu);
}
