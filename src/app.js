import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View, Navigator
} from 'react-native';

import Home from './containers/home';
import About from './containers/about';

export default class BRCAMobile extends Component {
  render() {
    return (
      this.props.navigator
    );
  }
}

BRCAMobile.defaultProps = {
  navigator: <Navigator
    initialRoute={{ name: 'Home', index: 0 }}
    navigationBar={
     <Navigator.NavigationBar
       routeMapper={{
         LeftButton: (route, navigator, index, navState) =>
          { return (<TouchableHighlight onPress={ () => this.props.navigator.pop() }><Text>Back</Text></TouchableHighlight>); },
         RightButton: (route, navigator, index, navState) =>
           { return (<Text>Done</Text>); },
         Title: (route, navigator, index, navState) =>
           { return (<Text>Awesome Nav Bar</Text>); },
       }}
       style={{backgroundColor: 'white'}}
     />
    }
    renderScene={
      (route, navigator) => {
        if (route.name == 'Home') {
          return <Home navigator={navigator} {...route.passProps} />
        }
        else if (route.name == 'About') {
          return <About navigator={navigator} {...route.passProps} />
        }
      }
    }
    style={{padding: 10, backgroundColor: '#ff0000' }}
  />
};

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
