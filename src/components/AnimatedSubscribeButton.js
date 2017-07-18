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
const AnimatedTouchableHighlight = Animated.createAnimatedComponent(TouchableHighlight);

import isString from 'lodash/isString';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

export default class SubscribeButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            widthValue: new Animated.Value(this.props.subscribed ? this.getMinWidth() : this.getMaxWidth()),
            innerOpacity: new Animated.Value(1),
            pastSubscribed: this.props.subscribed
        };

        this.state.backgroundColor = this.state.widthValue.interpolate({
            inputRange: [this.getMinWidth(), this.getMaxWidth()],
            outputRange: ['rgba(99, 196, 119, 1)', 'rgba(129, 129, 129, 1)']
        });

        // update caption text based on animation status
        this.state.widthValue.addListener((v) => {
            this.setState({
                pastSubscribed: v.value < (this.getMaxWidth() + this.getMinWidth())/2.0
            });
        });
    }

    onPress() {
        if (this.props.onSubscriptionChanged) {
            this.props.onSubscriptionChanged();
        }

        // this method triggers after subscribed is set
        // thus if subscribed is true we're transitioning from nonsubbed to subbed

        this.state.widthValue.setValue(this.props.subscribed ? this.getMinWidth() : this.getMaxWidth());

        Animated.sequence([
            // first, fade out the caption text
            Animated.timing(
                this.state.innerOpacity,
                {
                    toValue: 0,
                    duration: 300,
                    // useNativeDriver: true
                }
            ),

            // then, rescale/recolor in parallel
            Animated.timing(
                this.state.widthValue,
                {
                    toValue: this.props.subscribed ? this.getMaxWidth() : this.getMinWidth(),
                    duration: 200,
                    // useNativeDriver: true
                }
            ),

            // restore the caption text
            Animated.timing(
                this.state.innerOpacity,
                {
                    toValue: 1,
                    duration: 300,
                    // useNativeDriver: true
                }
            )

        ]).start();
    }

    componentWillReceiveProps(nextProps) {
        // to explain this weirdness, our subscription status changes before this method fires
        // we need to put ourselves in the opposite state so that we can animate changing to the new one
        // (but only do this if we're updating from an event fired on another screen, not this one)
        if (nextProps.subscribed !== this.props.subscribed && nextProps.subsLastUpdatedBy !== this.props.activeScreen) {
            this.state.widthValue.setValue(nextProps.subscribed ? this.getMinWidth() : this.getMaxWidth());
        }
    }

    getMinWidth() {
        return (this.props.abbreviated ? 100 : 200);
    }

    getMaxWidth() {
        return (this.props.abbreviated ? 130 : 240);
    }

    getCaption() {
        let response = "";
        let transitioned = this.state.pastSubscribed;  // (this.props.subscribed);

        if (this.props.abbreviated) {
            response = (transitioned)?"following":"not following";
        }
        else {
            response = (transitioned)?"following variant":"not following variant";
        }

        return response;
    }

    // ---
    // --- secondary render method borrowed from react-native-vector-icons/lib/icon-button.js
    // ---

    render() {
        const subBlockStatus = {
            width: this.state.widthValue
        };
        const subViewStatus = {
            backgroundColor: this.state.backgroundColor, // (this.props.subscribed ? '#63c477' : '#818181')
            opacity: this.state.innerOpacity
        };

        return (
            <AnimatedTouchableHighlight style={[styles.touchable, styles.blockStyle, subBlockStatus]} onPress={this.onPress.bind(this)}>
                <Animated.View style={[styles.container, styles.blockStyle, subBlockStatus, subViewStatus]}>
                    <Icon style={[ styles.icon, (this.props.abbreviated ? styles.abbreviatedIcon : null) ]}
                        name={ this.state.pastSubscribed ? "bookmark" : "bookmark-border" }
                        color="white" size={ this.props.abbreviated ? 18 : 22 } />
                    <Text style={[styles.text, (this.props.abbreviated ? styles.abbreviatedText : null)]}>{this.getCaption()}</Text>
                </Animated.View>
            </AnimatedTouchableHighlight>
        );
    }
}

SubscribeButton.defaultProps = {
    abbreviated: false,
    onSubscriptionChanged: null,
    activeScreen: null
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 8,
    },
    touchable: {
        overflow: 'hidden',
    },
    icon: {
        marginRight: 5,
    },
    abbreviatedIcon: {
        marginRight: 3
    },
    text: {
        fontWeight: '600',
        color: 'white',
        fontSize: 20,
        backgroundColor: 'transparent',
    },
    blockStyle: {
        overflow: 'hidden',
        borderRadius: 5,
        backgroundColor: '#818181'
    },
    abbreviatedText: {
        fontSize: 15
    }
});
