import React, {Component} from 'react';
import {
    Text, TextInput, View, ScrollView, Image, TouchableOpacity, StyleSheet,
    Alert, Platform,
    BackHandler
} from 'react-native';
import {connect} from "react-redux";

import LinkableMenuScreen from './LinkableMenuScreen';
import SearchBar from '../components/SearchBar';
import ScaryDebugNotice from "../components/ScaryDebugNotice";
import DisclaimerModal from "../components/DisclaimerModal";
import {set_license_agreed} from "../redux/general/actions";

import { version } from '../../package.json';

class HomeScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        }
    }

    static navigatorButtons = {
        leftButtons: [{
            icon: (Platform.OS === 'ios') ? require('../../img/navicon_menu.png') : null,
            id: 'sideMenu'
        }]
    };

    onChangeText(text) {
        this.setState({
            searchText: text
        })
    }

    onSubmit() {
        // leap to the search page if we have a query
        let query = this.state.searchText.slice(0);

        // FIXME: navigating to a different page clutters the search history; maybe having it on the same page is better
        this.props.navigator.resetTo({
            title: "Search",
            screen: "brca.SearchScreen",
            animated: false,
            passProps: {
                initialFilterText: query
            }
        });

        // clear the search box before we go
        this.setState({ searchText: '' });
    }

    render() {
        return (
            <ScrollView style={{flex: 1, padding: 0, backgroundColor: 'white'}}>
                <ScaryDebugNotice />

                <View style={{padding: 20}} testID="home-searchbar">
                    <SearchBar
                        text={this.state.searchText}
                        autoFocus={false}
                        onChangeText={this.onChangeText.bind(this)}
                        onSubmit={this.onSubmit.bind(this)} />

                    <View style={styles.info}>
                        <Text style={styles.paragraph}>The BRCA Exchange aims to advance our understanding of the genetic basis of breast cancer, ovarian cancer and other diseases by pooling data on BRCA1/2 genetic variants and corresponding clinical data from around the world. Search for BRCA1 or BRCA2 variants above.</Text>

                        <Text style={{fontSize: 5}}>&nbsp;</Text>

                        <Text style={styles.paragraph}>This app and its associated website are supported by the BRCA Challenge project, a driver project of the Global Alliance for Genomics and Health.</Text>
                    </View>

                    <View style={styles.logo}>
                        <Image style={{width: 133, height: 67}} source={require('../../img/logos/brcaexchange.jpg')} />
                    </View>
                </View>

                <DisclaimerModal
                    showLegend={!this.props.licenseAgreedVersion || this.props.licenseAgreedVersion !== version}
                    onDisagreeWithLicense={() => { BackHandler.exitApp(); }}
                    onDismissLicense={() => { this.props.onSetLicenseAgreed(version); }}
                />
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        licenseAgreedVersion: state.general.licenseAgreedVersion
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        onSetLicenseAgreed: (newVersion) => {
            dispatch(set_license_agreed(newVersion))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeScreen);


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
    }
});
