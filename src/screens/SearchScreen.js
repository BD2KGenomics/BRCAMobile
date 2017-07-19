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

export default class AboutScreen extends LinkableMenuScreen {
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
    drawUnderTabBar: false
  };

  render() {
    return (
      <View style={styles.container}>
        <FilteredTable navigator={this.props.navigator} initialText={this.props.initialFilterText} />
      </View>
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
