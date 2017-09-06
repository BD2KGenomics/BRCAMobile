import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import {screens} from '../metadata/screens';

// register all screens of the app (including internal ones)
export function registerScreens(store) {
    screens.forEach((screen) => {
        Navigation.registerComponent(screen.name, () => screen.component, store, Provider);
    });
}
