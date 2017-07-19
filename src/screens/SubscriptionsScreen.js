import React, {Component} from 'react';
import {
    Text, TextInput, View, ScrollView, ListView, Image, TouchableOpacity, TouchableHighlight, StyleSheet,
    Alert, Platform
} from 'react-native';
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { subscribe, unsubscribe } from '../redux/actions';

import LinkableMenuScreen from './LinkableMenuScreen';
import Subscriptions from '../components/Subscriptions';

class SubscriptionsScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);

        // store whether we originally had subscriptions on visiting this page
        this.state = {
            hadSubscriptions: this.props.subscriptions && Object.keys(this.props.subscriptions).length > 0,
            token: ''
        };

        this.onGoSearch = this.onGoSearch.bind(this);
    }

    static navigatorButtons = {
        leftButtons: [{
            icon: (Platform.OS === 'ios') ? require('../../img/navicon_menu.png') : null,
            id: 'sideMenu'
        }]
    };

    onRowClicked(d) {
        this.props.navigator.push({
            title: "Details",
            screen: "brca.DetailScreen",
            passProps: {
                data: d
            }
        });
    }

    isSubscribed(d) {
        return this.props.subscriptions.hasOwnProperty(d.id);
    }

    onSubscribeClicked(d) {
        if (!this.isSubscribed(d)) {
            this.props.onSubscribe(d);
        }
        else {
            this.props.onUnsubscribe(d);
        }
    }

    onGoSearch() {
        this.props.navigator.resetTo({
            title: "Search",
            screen: "brca.SearchScreen"
        });
    }

    render() {
        return (
            <ScrollView style={{flex: 1, padding: 20, backgroundColor: 'white'}}>
                { this.state.hadSubscriptions ?
                    <Subscriptions
                        subscriptions={this.props.subscriptions}
                        subsLastUpdatedBy={this.props.subsLastUpdatedBy}
                        onRowClicked={this.onRowClicked.bind(this)}
                        onSubscribeClicked={this.onSubscribeClicked.bind(this)}
                    />
                    :
                    <View>
                        <Text style={styles.noSubscriptionsText}>No followed variants yet!</Text>
                        <Text style={styles.noSubscriptionsText}>Find a variant to follow by searching{"\n"}and viewing details for a variant.</Text>

                        <View style={{flex: 1, alignItems: 'center'}}>
                            <View style={{width: 150, flex: 1}}>
                                <Icon.Button name="search" onPress={this.onGoSearch}>Go to Search</Icon.Button>
                            </View>
                        </View>
                    </View>
                }

                <View style={styles.helpView}>
                    <Text style={styles.helpTextHeader}>Following a Variant</Text>
                    <Text style={styles.helpText}>
                        When you follow a variant, you'll receive a push notification
                        whenever the clinical significance of that variant changes in the BRCA Exchange database.
                    </Text>
                </View>

                {/*<View style={styles.logo}>*/}
                    {/*<Image style={{width: 133, height: 67}} source={require('../../img/logos/brcaexchange.jpg')} />*/}
                {/*</View>*/}

                {/*<Text>Token: {this.props.token}</Text>*/}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop: 10,
        color: 'blue'
    },
    info: {
        backgroundColor: '#f1f1f1',
        padding: 28,
        borderRadius: 8
    },
    paragraph: {
        color: '#555',
        fontSize: 20
    },
    searchboxContainer: {
        marginTop: 5,
        marginBottom: 20
    },
    searchboxInput: {
        borderWidth: 1,
        padding: 6,
        color: '#555',
        borderColor: 'pink',
        borderRadius: 4,
        fontSize: 18
    },
    logo: {
        marginTop: 30,
        marginBottom: 120,
        alignItems: 'center',
    },
    helpTextHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5
    },
    helpText: {
        // fontStyle: 'italic',
        // textAlign: 'center'
        color: '#555'
    },
    helpView: {
        // marginTop: 20,
        // borderTopColor: '#eee',
        // borderTopWidth: 1,
        // paddingTop: 20,
        marginTop: 30,
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 15
    },
    noSubscriptionsText: {
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 20
    }
});

/* define the component-to-store connectors */

const mapStateToProps = (state_immutable) => {
    const state = state_immutable.toJS();

    return {
        // subscription info
        token: state.brca.token,
        subscriptions: state.brca.subscriptions,
        subsLastUpdatedBy: state.brca.subsLastUpdatedBy
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        onSubscribe: (item) => {
            dispatch(subscribe(item, 'subscriptions'))
        },
        onUnsubscribe: (item) => {
            dispatch(unsubscribe(item, 'subscriptions'))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubscriptionsScreen);
