import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    Text, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// import {screens} from '../metadata/screens';

export default class SidebarMenuItems extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        navbuttonProps: PropTypes.object.isRequired,
        buttonStyle: PropTypes.number.isRequired,
        onNavigateRequest: PropTypes.func.isRequired
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
                    <Text style={this.props.buttonStyle}>Search Variants</Text>
                </Icon.Button>

                <Icon.Button name="bookmark" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Following', 'brca.SubscriptionsScreen', false) }>
                    <Text style={this.props.buttonStyle}>Followed Variants</Text>
                </Icon.Button>

                <Icon.Button name="info" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('About', 'brca.AboutScreen', false) }>
                    <Text style={this.props.buttonStyle}>About This App</Text>
                </Icon.Button>

                {/*
                    screens.filter(x => x.hasOwnProperty('sidebar') && x.sidebar != null)
                        .map((x, idx) => {
                            const sideOpts = x.sidebar;

                            return (
                                <Icon.Button key={idx} name={sideOpts.icon} {...this.props.navbuttonProps}
                                    onPress={ () => this.props.onNavigateRequest(sideOpts.title, screen.name, sideOpts.resetStack) }>
                                    <Text style={this.props.buttonStyle}>{sideOpts.title}</Text>
                                </Icon.Button>
                            );
                        })
                */}

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
