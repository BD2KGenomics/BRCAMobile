import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet, Platform
} from 'react-native';

import LinkableMenuScreen from './LinkableMenuScreen';
import FilteredTable from '../components/FilteredTable';
import DismissableKeyboard from "../toolbox/DismissableKeyboard";
import {defaultNavButtons} from "./BaseSideMenu";

export default class SearchScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);
    }

    static navigatorButtons = defaultNavButtons;

    static navigatorStyle = {
        drawUnderTabBar: false
    };

    render() {
        return (
            <DismissableKeyboard>
                <View style={styles.container}>
                    <FilteredTable navigator={this.props.navigator} initialText={this.props.initialFilterText} />
                </View>
            </DismissableKeyboard>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop:10,
        color: 'blue'
    }
});
