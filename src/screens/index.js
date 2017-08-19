import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import AboutScreen from './AboutScreen';
import DetailScreen from './DetailScreen';
import SubscriptionsScreen from './SubscriptionsScreen';
import SettingsScreen from "./SettingsScreen";
import NotifyLogScreen from './NotifyLogScreen';
import SideMenu from './SideMenu';

import {screens} from '../metadata/screens';

// register all screens of the app (including internal ones)
export function registerScreens(store) {
    screens.forEach((screen) => {
        Navigation.registerComponent(screen.name, () => screen.component, store, Provider);
    });

    // Navigation.registerComponent('brca.HomeScreen', () => HomeScreen, store, Provider);
    // Navigation.registerComponent('brca.SearchScreen', () => SearchScreen, store, Provider);
    // Navigation.registerComponent('brca.AboutScreen', () => AboutScreen, store, Provider);
    // Navigation.registerComponent('brca.SubscriptionsScreen', () => SubscriptionsScreen, store, Provider);
    // Navigation.registerComponent('brca.DetailScreen', () => DetailScreen, store, Provider);
    // Navigation.registerComponent('brca.SettingsScreen', () => SettingsScreen, store, Provider);
    // Navigation.registerComponent('brca.SideMenu', () => SideMenu, store, Provider);
}
