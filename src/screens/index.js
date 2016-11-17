import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import AboutScreen from './AboutScreen';
import DetailScreen from './DetailScreen';
//noinspection JSFileReferences
import SideMenu from './SideMenu';

// register all screens of the app (including internal ones)
export function registerScreens(store) {
  Navigation.registerComponent('brca.HomeScreen', () => HomeScreen, store, Provider);
  Navigation.registerComponent('brca.SearchScreen', () => SearchScreen, store, Provider);
  Navigation.registerComponent('brca.AboutScreen', () => AboutScreen, store, Provider);
  Navigation.registerComponent('brca.DetailScreen', () => DetailScreen, store, Provider);
  Navigation.registerComponent('brca.SideMenu', () => SideMenu, store, Provider);
}
