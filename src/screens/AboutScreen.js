import React, {Component} from 'react';
import {
    Text, Image,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import LinkableMenuScreen from './LinkableMenuScreen';

export default class AboutScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);
    }

    static navigatorButtons = {
        leftButtons: [{
            icon: require('../../img/navicon_menu.png'),
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
                <Text>
                {`This app provides information on catalogued BRCA1 and BRCA2 genetic variants. Currently, it shows variants that have been curated and classified by an international expert panel, the ENIGMA consortium, to assess their pathogenicity (associated disease risk). In an upcoming version, an optional setting will allow the user to look at unclassified variants. In most cases, these variants are awaiting expert review, and their pathogenicity has not yet been established.

The BRCA Exchange website is a product of the BRCA Challenge of the Global Alliance for Genomics and Health. The web app and underlying database were developed by Molly Zhang, Charles Markello, Mary Goldman, Brian Craft, Jing Zhu, David Haussler, Melissa Cline and Benedict Paten at the Computational Genomics Lab at the UC Santa Cruz Genomics Institute and Gunnar Rätsch at Memorial Sloan Kettering Cancer Center, and Rachel Liao of the Global Alliance for Genomics and Health with input and feedback from many members of the BRCA Challenge working groups.

Variant data displayed in this app are made available using the standards based GA4GH Genomics API. For more information, and example usage please visit our API description.`}
                </Text>

                <View style={styles.logo}>
                    <Image style={{width: 300 }} resizeMode='contain' source={require('../../img/logos/ga4gh.png')} />
                    <Image style={{width: 300 }} resizeMode='contain' source={require('../../img/logos/ucsc.png')} />
                    <Image style={{width: 300 }} resizeMode='contain' source={require('../../img/logos/mskcc.jpg')} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop:10,
        color: 'blue'
    },
    logo: {
        marginTop: 30,
        marginBottom: 10,
        alignItems: 'center',
    }
});
