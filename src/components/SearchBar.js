import React, {Component} from 'react';
import {
  Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity, StyleSheet,
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
  }

  handleChangeText(text) {
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
  }

  handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  render() {
    return (
      <View style={styles.searchboxContainer}>
        <TextInput style={styles.searchboxInput}
          placeholder='search for "c.1105G>A" or "brca1"'
          value={this.props.text}
          onChangeText={this.handleChangeText.bind(this)}
          onSubmitEditing={this.handleSubmit.bind(this)}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={this.props.autoFocus}
          returnKeyType="search"
          underlineColorAndroid="transparent" />
      </View>
    )
  }
}

/*
SearchBar.propTypes = {
  onChangeText: React.PropTypes.function,
  onSubmit: React.PropTypes.function
};
*/

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
