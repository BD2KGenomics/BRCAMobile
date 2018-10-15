import React, {Component} from 'react';
import {
    Text, Button, TouchableHighlight, View, StyleSheet, Linking, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class extends Component {
    constructor(props) {
        super(props);
        this.handlePress = this.handlePress.bind(this);
    }

    handlePress() {
        const targetURL = `https://brcaexchange.org/variant/${this.props.variantID}`;

        Alert.alert(
            'Open External Link',
            `View variant details on brcaexchange.org?`,
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => {
                    console.log("Attempting to open ", targetURL);
                    Linking.openURL(targetURL);
                } }
            ],
            { cancelable: true }
        );
    }

    render() {
        return (
            <TouchableHighlight style={styles.brcalink} onPress={this.handlePress}>
                <Icon name="open-in-browser" size={28} color="white" />
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    brcalink: {
        position: 'absolute',
        right: 20,
        top: 20,

        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 5,
        padding: 5,
        backgroundColor: '#ccc'
    }
});
