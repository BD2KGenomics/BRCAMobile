import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

export default class Home extends Component {
  _navigate() {
    this.props.navigator.push({
      name: 'About', // Matches route.name
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          This is the home route!
        </Text>
        <View>
          <TouchableHighlight onPress={ () => this._navigate() }>
            <Text>Go to About</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
