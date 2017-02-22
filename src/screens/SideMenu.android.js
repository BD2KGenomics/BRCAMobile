import React, {Component} from 'react';
import {
  Text, Image, View, ScrollView,
  TouchableOpacity,
  StyleSheet,
  AlertIOS
} from 'react-native';

import BaseSideMenu from './BaseSideMenu';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class SideMenu extends BaseSideMenu {
  constructor(props) {
    super(props);
  }

  render() {
    const navbuttonProps = {
      size: 30,
      width: 260,
      color: "#eee",
      borderRadius: 0,
      backgroundColor: "transparent",
      underlayColor: "#555"
    };
    // size={30} color="#eee" borderRadius={0} backgroundColor="transparent"

    return (
      <View style={styles.container}>
        <View style={styles.titlebutton}>
          <TouchableOpacity onPress={ this._toggleDrawer.bind(this) }>
            <Icon name="menu" size={22} color="#fff" />
            {/* <Image style={{width: 22, height: 22}} source={require('../../img/navicon_menu_invert.png')} /> */}
          </TouchableOpacity>
          <Text style={styles.title}>BRCA Exchange</Text>
        </View>

        <View style={{flex: 1}}>
          <Icon.Button name="home" {...navbuttonProps}
            onPress={ this.navigateTo.bind(this, 'Home', 'brca.HomeScreen', true) }>
            <Text style={styles.button}>Home</Text>
          </Icon.Button>

          <Icon.Button name="search" {...navbuttonProps}
            onPress={ this.navigateTo.bind(this, 'Search', 'brca.SearchScreen', false) }>
            <Text style={styles.button}>Search</Text>
          </Icon.Button>

          <Icon.Button name="bookmark" {...navbuttonProps}
              onPress={ this.navigateTo.bind(this, 'Following', 'brca.SubscriptionsScreen', false) }>
            <Text style={styles.button}>Following</Text>
          </Icon.Button>

          <Icon.Button name="info" {...navbuttonProps}
            onPress={ this.navigateTo.bind(this, 'About', 'brca.AboutScreen', false) }>
            <Text style={styles.button}>About</Text>
          </Icon.Button>
        </View>

        <Text style={styles.version}>brca-exchange mobile v0.1</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
    paddingLeft: 17,
    opacity: 0.8,
    backgroundColor: '#333',
    alignItems: 'flex-start',
    // backgroundColor: 'white',
    justifyContent: 'flex-start',
    width: 300
  },
  titlebutton: {
    height: 39,
    width: 260,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    color: 'white',
    marginLeft: 15,
    marginTop: -5,
    fontWeight: '500'
  },
  button: {
    textAlign: 'left',
    fontSize: 18,
    marginBottom: 10,
    marginTop:10,
    color: '#eee',
    fontWeight: '300'
  },
  version: {
    flex: 0,
    width: 260,
    borderTopColor: '#777',
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 20,
    color: '#888',
    fontSize: 15,
    textAlign: 'center'
  }
});
