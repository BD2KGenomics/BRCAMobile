import React, {Component} from 'react';
import {
  Text, Image, View, ScrollView,
  TouchableOpacity,
  StyleSheet,
  AlertIOS
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class SideMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const navbuttonProps = {
      size: 30,
      color: "#eee",
      borderRadius: 0,
      backgroundColor: "transparent"
    };
    // size={30} color="#eee" borderRadius={0} backgroundColor="transparent"

    return (
      <View style={styles.container}>
        <View style={styles.titlebutton}>
          <TouchableOpacity onPress={ this._toggleDrawer.bind(this) }>
            <Image style={{width: 22, height: 22}} source={require('../../img/navicon_menu_invert.png')} />
          </TouchableOpacity>
          <Text style={styles.title}>BRCA Exchange</Text>
        </View>

        <View style={{flex: 1}}>
          <Icon.Button name="home" {...navbuttonProps} onPress={ this.onHomePress.bind(this) }>
            <Text style={styles.button}>Home</Text>
          </Icon.Button>

          <Icon.Button name="search" {...navbuttonProps} onPress={ this.onSearchPress.bind(this) }>
            <Text style={styles.button}>Search</Text>
          </Icon.Button>

          <Icon.Button name="info" {...navbuttonProps} onPress={ this.onAboutPress.bind(this) }>
            <Text style={styles.button}>About</Text>
          </Icon.Button>
        </View>

        <Text style={styles.version}>brca-exchange mobile v0.1</Text>
      </View>
    );
  }

  onHomePress() {
    this.props.navigator.resetTo({
      title: "Home",
      screen: "brca.HomeScreen"
    });
    this._toggleDrawer();
  }

  onSearchPress() {
    this.props.navigator.push({
      title: "Search",
      screen: "brca.SearchScreen"
    });
    this._toggleDrawer();
  }

  onAboutPress() {
    this.props.navigator.push({
      title: "About",
      screen: "brca.AboutScreen"
    });
    this._toggleDrawer();
  }

  _toggleDrawer() {
    this.props.navigator.toggleDrawer({
      to: 'closed',
      side: 'left',
      animated: true
    });
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
