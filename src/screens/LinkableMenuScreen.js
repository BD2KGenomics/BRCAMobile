import React, {Component} from 'react';

export default class LinkableMenuScreen extends Component {
    constructor(props) {
        super(props);
        // if you want to listen on navigator events, set this up
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'menu' || event.id === 'sideMenu') {
            // centrally handle menu visibility button for the child screens
            this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true
            });
        }
        else if (event.type === 'DeepLink') {
            // recall that deeplink events are broadcast to every screen
            //  we want to handle this event only if it's about us (the main screen)
            const parts = event.link.split('/');

            if (parts[0] === 'main') {
                const params = JSON.parse(parts[1]);

                // console.log("Deep reset to " + params.title + " from ", this.props.navigator.screenInstanceID);

                // we always do a full reset on a deep link
                this.props.navigator.resetTo({
                    title: params.title,
                    screen: params.screen
                });
            }
            else if (parts[0] === 'updated') {
                const params = JSON.parse(parts[1]);

                this.props.navigator.push({
                    title: 'Details',
                    screen: 'brca.DetailScreen',
                    passProps: {
                        variant_id: params.variant_id
                    }
                })
            }
        }
        else if (this.childNavigatorEvent !== null && typeof this.childNavigatorEvent == 'function') {
            // propogate navigation event to inheriting classes, if they're interested
            this.childNavigatorEvent(event);
        }
    }
}
