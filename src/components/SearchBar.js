import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
    Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity, StyleSheet,
    Keyboard,
    Alert, Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import debounce from 'lodash/debounce';

export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        // needed due to a bug on android where certain returnKeyTypes fire twice in quick succession
        // refer to https://github.com/facebook/react-native/issues/9306
        this.handleSubmit = debounce(this.handleSubmit, 100);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
    }

    static propTypes = {
        onChangeText: PropTypes.func,
        onSubmit: PropTypes.func
    };

    handleChangeText(text) {
        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    }

    handleSubmit() {
        if (this.props.onSubmit) {
            Keyboard.dismiss();
            this.props.onSubmit();
        }
    }

    render() {
        return (
            <View style={styles.searchboxContainer}>
              <TextInput style={styles.searchboxInput}
                  testID="searchbox-textinput"
                  placeholder='search for "c.1105G>A" or "brca1"'
                  value={this.props.text}
                  onChangeText={this.handleChangeText}
                  onSubmitEditing={this.handleSubmit}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={this.props.autoFocus}
                  returnKeyType="search"
                  underlineColorAndroid="transparent" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchboxContainer: {
        marginTop: 5,
        marginBottom: 20
    },
    searchboxInput: {
        borderWidth: 1,
        height: 40,
        padding: 6,
        color: '#555',
        borderColor: 'pink',
        borderRadius: 4,
        fontSize: 18
    }
});
