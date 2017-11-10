import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {store} from '../app.js';

export default class LinkableMenuScreen extends Component {
    constructor(props) {
        super(props);

        // console.log("LinkableMenuScreen: ", props);
        // if you want to listen on navigator events, set this up
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        const state_debugging = store.getState().get('debugging');

        if (state_debugging.get('isDebugging') && !state_debugging.get('isOrangeHeaderHidden')) {
            this.props.navigator.setStyle({
                navBarBackgroundColor: '#ffdead'
            });
        }
    }

    async onNavigatorEvent(event) {
        /*
        console.log("Navigation event: ", event);

        const isVisible = await this.props.navigator.screenIsCurrentlyVisible();
        const id = await Navigation.getCurrentlyVisibleScreenId();

        console.log("ID: ", id, ", visible?: ", isVisible);

        if (!isVisible) {
            return;
        }
        */

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

            // only allow these events to be handled by the root screen
            Navigation.getCurrentlyVisibleScreenId().then(x => {
                console.log("Deep link; received by screen: ", x, ", params: ", parts);
            });

            // FIXME: make sure only the main screen handles these events
            // perhaps look into lifecycle tracking to see if we're the root

            if (parts[0] === 'main') {
                const params = JSON.parse(parts[1]);

                console.log("Deep linking from root w/params: ", parts);

                // FIXME: we need to find a way to only reset if we have to
                // this is related to the issue of every screen acting on a deeplink event

                const target = {
                    title: params.title,
                    screen: params.screen
                };

                if (true || params.doReset) {
                    this.props.navigator.resetTo(target);
                }
                else {
                    this.props.navigator.push(target);
                }

            }
            else if (parts[0] === 'updated') {
                const params = JSON.parse(parts[1]);

                this.props.navigator.push({
                    title: 'Details',
                    screen: 'brca.DetailScreen',
                    passProps: {
                        variant_id: params.variant_id,
                        hint: 'fetch'
                    }
                })
            }
            else if (parts[0] === 'notifylog') {
                const params = JSON.parse(parts[1]);

                this.props.navigator.resetTo({
                    title: 'Notify Log',
                    screen: 'brca.NotifyLogScreen',
                    passProps: {
                        variant_count: params.variant_count
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
