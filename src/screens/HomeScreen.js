import React, {Component} from 'react';
import {
  Text, TextInput, View, ScrollView, Image, TouchableOpacity, StyleSheet,
  Alert, Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import debounce from 'lodash/debounce';

import LinkableMenuScreen from './LinkableMenuScreen';
import SearchBar from '../components/SearchBar';

export default class HomeScreen extends LinkableMenuScreen {
  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    // makes the page wait 2 seconds before moving to the search page
    // this.onFilterChanged = debounce(this.onFilterChanged, 2000);

    this.state = {
      searchText: ''
    }
  }

  static navigatorButtons = {
    leftButtons: [{
      icon: require('../../img/navicon_menu.png'),
      id: 'menu'
    }]
  };
  
  /*
  static navigatorButtons = {
    leftButtons: [{
      icon: require('../../img/navicon_menu.png'),
      id: 'menu'
    }]
  };

  onNavigatorEvent(event) {
    if (event.id === 'menu') {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true
      });
    }
  }
  */

  onChangeText(text) {
    this.setState({
      searchText: text
    })
  }

  onSubmit() {
    // FIXME: should we jump to the variants page like the site does?
    if (this.state.searchText !== '') {
      // leap to the search page if we have a query
      var query = this.state.searchText.slice(0);

      // FIXME: navigating to a different page clutters the search history; maybe having it on the same page is better
      this.props.navigator.push({
        title: "Search",
        screen: "brca.SearchScreen",
        animated: false,
        passProps: {
          initialFilterText: query
        }
      })

      // clear the search box before we go
      this.setState({ searchText: '' });
    }
  }

  render() {
    return (
      <ScrollView style={{flex: 1, padding: 20, backgroundColor: 'white'}}>
        <SearchBar
          text={this.state.searchText}
          autoFocus={false}
          onChangeText={this.onChangeText.bind(this)}
          onSubmit={this.onSubmit.bind(this)} />

        <View style={styles.info}>
          <Text style={styles.paragraph}>The BRCA Exchange aims to advance our understanding of the genetic basis of breast cancer, ovarian cancer and other diseases by pooling data on BRCA1/2 genetic variants and corresponding clinical data from around the world. Search for BRCA1 or BRCA2 variants above.</Text>

          <Text>&nbsp;</Text>

          <Text style={styles.paragraph}>This website is supported by the BRCA Exchange of the Global Alliance for Genomics and Health.</Text>
        </View>

        <View style={styles.logo}>
          <Image style={{width: 133, height: 67}} source={require('../../img/logos/brcaexchange.jpg')} />
        </View>
      </ScrollView>
    );
  }
}

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
