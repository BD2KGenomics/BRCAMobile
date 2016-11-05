import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

export default class About extends Component {
  _navigate() {
    this.props.navigator.push({
      name: 'Home', // Matches route.name
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          This is the about page...
        </Text>
        <View>
          <TouchableHighlight onPress={ () => this._navigate() }>
            <Text>Go to Home</Text>
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
  }
});
