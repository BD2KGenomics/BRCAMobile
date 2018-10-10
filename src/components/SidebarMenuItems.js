import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    ScrollView,
    Text, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from "react-redux";
import {set_license_agreed} from "../redux/general/actions";

// import {screens} from '../metadata/screens';

class SidebarMenuItems extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        navbuttonProps: PropTypes.object.isRequired,
        buttonStyle: PropTypes.object.isRequired,
        onNavigateRequest: PropTypes.func.isRequired
    };

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <Icon.Button name="home" testID="home" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Home', 'brca.HomeScreen', true) }>
                    <Text style={this.props.buttonStyle}>Home</Text>
                </Icon.Button>

                <Icon.Button name="search" testID="search" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Search', 'brca.SearchScreen', false) }>
                    <Text style={this.props.buttonStyle}>Search Variants</Text>
                </Icon.Button>

                <Icon.Button name="bookmark" testID="following" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Following', 'brca.SubscriptionsScreen', false) }>
                    <Text style={this.props.buttonStyle}>Followed Variants</Text>
                </Icon.Button>

                <Icon.Button name="speaker-notes" testID="notify-log" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Notify Log', 'brca.NotifyLogScreen', false) }>
                    <Text style={this.props.buttonStyle}>Notify Log</Text>
                </Icon.Button>

                <Icon.Button name="info" testID="about" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('About', 'brca.AboutScreen', false) }>
                    <Text style={this.props.buttonStyle}>About This App</Text>
                </Icon.Button>

                <Icon.Button name="help" testID="user-guide" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Usage Guide', 'brca.HelpScreen', false) }>
                    <Text style={this.props.buttonStyle}>User Guide</Text>
                </Icon.Button>

                <Icon.Button name="warning" {...this.props.navbuttonProps}
                    onPress={ () => {
                        // first, clear the disclaimer bit, then go home
                        this.props.onUnsetLicenseAgreed();
                        this.props.onNavigateRequest('Home', 'brca.HomeScreen', true);
                    } }>
                    <Text style={this.props.buttonStyle}>Disclaimer</Text>
                </Icon.Button>

                {
                    this.props.isDebugging &&
                    <Icon.Button name="bug-report" {...this.props.navbuttonProps}
                        onPress={ () => this.props.onNavigateRequest('Dev Settings', 'brca.DebugScreen', false) }>
                        <Text style={this.props.buttonStyle}>Dev Settings</Text>
                    </Icon.Button>
                }
            </ScrollView>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        isDebugging: state.debugging.isDebugging
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUnsetLicenseAgreed: () => {
            dispatch(set_license_agreed(null))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SidebarMenuItems);
