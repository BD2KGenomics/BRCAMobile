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
  }

  static navigatorButtons = {
    leftButtons: [{
      icon: require('../../img/navicon_menu.png'),
      id: 'menu'
    }]
  };

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
