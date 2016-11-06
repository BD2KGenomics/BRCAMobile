import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default class AboutScreen extends Component {
  static navigatorStyle = {
    drawUnderTabBar: true
  };
  constructor(props) {
    super(props);
  }
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
