import React, {Component} from 'react';
import {
    Text, View, ScrollView,
    TouchableOpacity, StyleSheet
} from 'react-native';

import DetailDisplay from '../components/DetailDisplay';

export default class DetailScreen extends Component {
    static navigatorStyle = {
        drawUnderTabBar: true
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <DetailDisplay data={this.props.data} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop:10,
        color: 'blue'
    }
});
