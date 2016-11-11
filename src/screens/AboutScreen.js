import React, {Component} from 'react';
import {
  Text,
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

  static navigatorStyle = {
    drawUnderTabBar: true
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={ this.onPushHome.bind(this) }>
          <Text style={styles.button}>Push Home Screen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onPushHome() {
    // try resetTo({...}) as well, and popToRoot()
    this.props.navigator.push({
      title: "Home",
      screen: "brca.HomeScreen"
    });
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
