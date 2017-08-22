import React, {Component} from 'react';
import {
    Text, View, StyleSheet
} from 'react-native';

import DetailDisplay from '../components/DetailDisplay';

export default class DetailScreen extends Component {
    constructor(props) {
        super(props);
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
