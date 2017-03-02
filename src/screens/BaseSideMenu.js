import React, {Component} from 'react';

export default class BaseSideMenu extends Component {
  constructor(props) {
    super(props);
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
