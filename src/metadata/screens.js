/**
 * Created by Faisal on 7/17/17.
 */

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AboutScreen from '../screens/AboutScreen';
import DetailScreen from '../screens/DetailScreen';
import SubscriptionsScreen from '../screens/SubscriptionsScreen';
import SettingsScreen from "../screens/SettingsScreen";
import SideMenu from '../screens/SideMenu';

export const screens = [
    {
        name: 'brca.HomeScreen',
        component: HomeScreen,
        sidebar: {
            title: 'Home',
            icon: 'home',
            resetStack: true
        },
    },
    {
        name: 'brca.SearchScreen',
        component: SearchScreen,
        sidebar: {
            title: 'Search Variants',
            icon: 'search',
            resetStack: false
        },

    },
    {
        name: 'brca.SubscriptionsScreen',
        component: SubscriptionsScreen,
        sidebar: {
            title: 'Followed Variants',
            icon: 'bookmark',
            resetStack: false
        },
    },
    {
        name: 'brca.AboutScreen',
        component: AboutScreen,
        sidebar: {
            title: 'About',
            icon: 'info',
            resetStack: false
        },
    },

    {
        name: 'brca.SettingsScreen',
        component: SettingsScreen,
        sidebar: null,
    },
    {
        name: 'brca.DetailScreen',
        component: DetailScreen,
        sidebar: null,
    },
    {
        name: 'brca.SideMenu',
        component: SideMenu,
        sidebar: null,
    },
];
