import React, {Component} from 'react';
import {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Button,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Platform,
    Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class SubscribeButton extends Component {
    constructor(props) {
        super(props);
    }

    // 180 at smaller size, 215 at larger

    static buttonProps = {
        subscribed: {
            backgroundColor: '#e7b34e',
            name: 'clear' // clear oder bookmark-border
        },
        unsubscribed: {
            backgroundColor: '#63c477',
            name: 'check' // check oder bookmark
        },
        abbreviated: {
            fontSize: 12,
            iconStyle: {marginRight: 3},
            padding: 3,
            paddingRight: 6
        }
    };

    onPress() {
        if (this.props.onSubscriptionChanged) {
            this.props.onSubscriptionChanged();
        }
    }

    getCaption() {
        if (this.props.abbreviated) {
            return (this.props.subscribed)?"unfollow":"follow";
        }
        else {
            return (this.props.subscribed)?"unfollow variant":"follow variant";
        }
    }

    render() {
        return (
            <Icon.Button
                {...((this.props.subscribed) ? SubscribeButton.buttonProps.subscribed : SubscribeButton.buttonProps.unsubscribed)}
                {...(this.props.abbreviated ? SubscribeButton.buttonProps.abbreviated : null)}
                onPress={this.onPress.bind(this)}>
                {this.getCaption()}
            </Icon.Button>
        );
    }
}

SubscribeButton.defaultProps = {
    abbreviated: false,
    onSubscriptionChanged: null
};
