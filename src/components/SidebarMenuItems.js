import React, {Component} from 'react';

import {
    Text, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class SidebarMenuItems extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        navbuttonProps: React.PropTypes.object.isRequired,
        buttonStyle: React.PropTypes.number.isRequired,
        onNavigateRequest: React.PropTypes.func.isRequired
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <Icon.Button name="home" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Home', 'brca.HomeScreen', true) }>
                    <Text style={this.props.buttonStyle}>Home</Text>
                </Icon.Button>

                <Icon.Button name="search" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Search', 'brca.SearchScreen', false) }>
                    <Text style={this.props.buttonStyle}>Search</Text>
                </Icon.Button>

                <Icon.Button name="bookmark" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Following', 'brca.SubscriptionsScreen', false) }>
                    <Text style={this.props.buttonStyle}>Following</Text>
                </Icon.Button>

                <Icon.Button name="info" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('About', 'brca.AboutScreen', false) }>
                    <Text style={this.props.buttonStyle}>About</Text>
                </Icon.Button>

                {/*
                <Icon.Button name="help" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('View Test', 'brca.ViewTestScreen', false) }>
                    <Text style={this.props.buttonStyle}>View Test</Text>
                </Icon.Button>
                */}
            </View>
        );
    }
}