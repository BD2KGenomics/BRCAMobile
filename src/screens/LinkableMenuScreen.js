import React, {Component} from 'react';

export default class LinkableMenuScreen extends Component {
  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === 'menu') {
      // centrally handle menu visibility button for the child screens
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true
      });
    }
    else if (event.type == 'DeepLink') {
      // recall that deeplink events are broadcast to every screen
      //  we want to handle this event only if it's about us (the main screen)
      const parts = event.link.split('/');
      if (parts[0] == 'main') {
        const params = JSON.parse(parts[1]);

        // handle the link somehow, usually run a this.props.navigator command
        if (params.doReset === true) {
          console.log("Deep reset to " + params.title + " from ", this.props.navigator.screenInstanceID);

          this.props.navigator.resetTo({
            title: params.title,
            screen: params.screen
          })
        }
        else {
          console.log("Deep push to " + params.title + " from ", this.props.navigator.screenInstanceID);

          this.props.navigator.push({
            title: params.title,
            screen: params.screen
          })
        }
      }
    }
    else if (this.childNavigatorEvent !== null && typeof this.childNavigatorEvent == 'function') {
      // propogate navigation event to inheriting classes, if they're interested
      this.childNavigatorEvent(event);
    }
  }
}
