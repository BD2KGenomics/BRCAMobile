import React, {Component} from 'react';
import {Platform} from "react-native";

export const defaultNavButtons = {
    leftButtons: [{
        icon: (Platform.OS === 'ios') ? require('../../img/navicon_menu.png') : null,
        testID: "hamburger-menu",
        id: 'sideMenu'
    }]
};

export default class BaseSideMenu extends Component {
    constructor(props) {
        super(props);

        this.navigateTo = this.navigateTo.bind(this);
    }

    navigateTo(title, screen, reset) {
        this._toggleDrawer();

        const t = {
            title: title,
            screen: screen,
            doReset: reset
        };

        // console.log("Title: ", title, "Screen: ", screen, "Reset: ", reset);
        // console.log(JSON.stringify(t));

        /*
        this.props.navigator.push({
            title: title,
            screen: screen
        });
        */

        this.props.navigator.handleDeepLink({
            link: 'main/' + JSON.stringify(t)
        });
    }

    _toggleDrawer() {
        this.props.navigator.toggleDrawer({
            to: 'closed',
            side: 'left',
            animated: true
        });
    }
}
