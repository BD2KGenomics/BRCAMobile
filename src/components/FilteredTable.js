import React, {Component} from 'react';
import {
  Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity, StyleSheet,
  Alert, Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import debounce from 'lodash/debounce';

export class SearchBar extends Component {
  constructor(props) {
    super(props);
    // needed due to a bug on android where certain returnKeyTypes fire twice in quick succession
    // refer to https://github.com/facebook/react-native/issues/9306
    this.handleSubmit = debounce(this.handleSubmit, 100);
  }

  handleChangeText(text) {
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
  }

  handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  render() {
    return (
      <View style={styles.searchboxContainer}>
        <TextInput style={styles.searchboxInput}
          placeholder='search for "c.1105G>A" or "brca1"'
          value={this.props.text}
          onChangeText={this.handleChangeText.bind(this)}
          onSubmitEditing={this.handleSubmit.bind(this)}
          autoFocus={true}
          returnKeyType="search"
          underlineColorAndroid="transparent" />
      </View>
    )
  }
}

export class ResultsTable extends Component {
  constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([
          {name: 'BRCA1', val: 'hi'},
          {name: 'BRCA1', val: 'yo'},
          {name: 'BRCA1', val: 'hola'},
          {name: 'BRCA2', val: 'meow?'},
          {name: 'BRCA2', val: 'hey'},
          {name: 'BRCA2', val: 'howdy'},
          {name: 'BRCA2', val: 'wutup'},
        ]),
      };
    }

    renderHeader() {
      return (
        <View style={styles.header}>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Value</Text>
        </View>
      )
    }

    renderRow(d) {
      return (
        <View style={styles.row}>
          <Text style={styles.rowCell}>{d.name}</Text>
          <Text style={styles.rowCell}>{d.val}</Text>
        </View>
      );
    }

    render() {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderHeader={this.renderHeader.bind(this)}
          renderRow={this.renderRow.bind(this)}
        />
      );
    }
}

export default class FilteredTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: this.props.initialText
    };
  }

  onChangeText(text) {
    this.setState({
      searchText: text
    })
  }

  render() {
    return (
      <View>
        <SearchBar text={this.state.searchText} onChangeText={this.onChangeText.bind(this)} />

        <Text>{this.state.searchText}</Text>

        <ResultsTable />
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
  header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black'
  },
  headerCell: {
    flex: 1,
    padding: 5,
    color: 'white',
    fontWeight: '500'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#aaa'
  },
  rowCell: {
    flex: 1,
    padding: 5
  }
});
