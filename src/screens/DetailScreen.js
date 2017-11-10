import React, {Component} from 'react';
import {
    Text, View, StyleSheet
} from 'react-native';

import DetailDisplay from '../components/DetailDisplay';
import {store} from '../app.js';

export default class DetailScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const state_debugging = store.getState().get('debugging');

        if (state_debugging.get('isDebugging') && !state_debugging.get('isOrangeHeaderHidden')) {
            this.props.navigator.setStyle({
                navBarBackgroundColor: '#ffdead'
            });
        }
    }

    static navigatorStyle = {
        drawUnderTabBar: true
    };

    render() {
        return (
            <View style={styles.container}>
                <DetailDisplay variant_id={this.props.variant_id} hint={this.props.hint} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: 'white'
    }
});
