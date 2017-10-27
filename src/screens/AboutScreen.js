import React, {Component} from 'react';
import {
    Text, Image,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet, Platform, Linking
} from 'react-native';
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';

import LinkableMenuScreen from './LinkableMenuScreen';

class AboutScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);
    }

    static navigatorButtons = {
        leftButtons: [{
            icon: (Platform.OS === 'ios') ? require('../../img/navicon_menu.png') : null,
            id: 'sideMenu'
        }]
    };

    static navigatorStyle = {
        drawUnderTabBar: true
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}>About This App</Text>
                <Text style={styles.prose}>
                {`This app provides information on catalogued BRCA1 and BRCA2 genetic variants, including variant classifications that have been curated by an international expert panel, the ENIGMA consortium, to assess their pathogenicity (associated disease risk).  Variants listed as ‘not yet reviewed’ will be classified by the ENIGMA consortium soon.

The BRCA Exchange website is a product of the BRCA Challenge of the Global Alliance for Genomics and Health. The website and underlying database were developed by Molly Zhang, Charles Markello, Mary Goldman, Brian Craft, Zack Fischmann, Joe Thomas, David Haussler, Melissa Cline and Benedict Paten at the Computational Genomics Lab at the UC Santa Cruz Genomics Institute, Faisal Alquaddoomi, Marc Zimmerman and Gunnar Rätsch at Eidgenössische Technische Hochschule Zürich, and Rachel Liao at the Broad Institute and the Global Alliance for Genomics and Health, with input and feedback from many members of the BRCA Challenge working groups.

Variant data displayed in this app are made available using the standards-based GA4GH Genomics API.`}
                </Text>

                <View style={styles.websiteLink}>
                    <Icon.Button
                        style={styles.websiteLinkButton}
                        iconStyle={{marginRight: 5}}
                        name="open-in-browser" backgroundColor="#5ac"
                        onPress={() => Linking.openURL("http://brcaexchange.org")}
                    >
                        <Text style={styles.websiteLinkButtonText}>visit brcaexchange.org</Text>
                    </Icon.Button>
                </View>

                <View style={styles.logo}>
                    <Image style={{width: 300, marginBottom: 30 }} resizeMode='contain' source={require('../../img/logos/enigma_wide.png')} />
                    <Image style={{width: 320, marginBottom: 10 }} resizeMode='contain' source={require('../../img/logos/ucsc_narrow.png')} />
                    <Image style={{width: 300, marginBottom: 5 }} resizeMode='contain' source={require('../../img/logos/ethz_simple.png')} />
                    <Image style={{width: 300, marginBottom: 0 }} resizeMode='contain' source={require('../../img/logos/ga4gh.png')} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20,
        padding: 20,
        paddingBottom: 0
    },
    prose: {
        lineHeight: 18,
        paddingLeft: 20,
        paddingRight: 20
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop:10,
        color: 'blue'
    },
    websiteLink: {
        alignItems: 'center',
        margin: 20,
        marginTop: 40
    },
    websiteLinkButton: {
        // width: 200
    },
    websiteLinkButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    logo: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center'
    },
    tokenText: {
        fontSize: 10,
        color: '#eee'
    }
});


const mapStateToProps = (state_immutable) => {
    return {};
};

export default connect(
    mapStateToProps
)(AboutScreen);
