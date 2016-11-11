import React, {Component} from 'react';
import {
  Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity,
  StyleSheet, Alert, Platform
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import debounce from 'lodash/debounce';

import SearchBar from './SearchBar';
import ResultsTable from './ResultsTable';

export default class FilteredTable extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

    this.state = {
      searchText: this.props.initialText,
      itemDataSrc: this.ds.cloneWithRows([]),
      isLoading: false,
      pageSize: 100, // we'll grab records in increments of this
      pageNum: 0,
      resultsCount: 0,
      synonyms: 0
    };
  }

  //
  // core event and lifecycle handlers
  //

  componentDidMount() {
    if (this.state.searchText && this.state.searchText !== '') {
      this.onSubmit();
    }
  }

  onChangeText(text) {
    this.setState({
      searchText: text
    });
  }

  onSubmit() {
    // we want to dismiss the previous query entirely
    this.setState({
      isLoading: true,
      itemDataSrc: this.ds.cloneWithRows([]),
      pageNum: 0,
      synonyms: '?',
      resultsCount: '?'
    });

    // fire off a fetch and bind the result
    this.getItemsForQuery(this.state.searchText, this.state.pageSize, this.state.pageNum, 'init')
      .then((responseJson) => {
        // later we'll concatenate to this collection as we scroll
        // this is the initial assignment
        this._data = responseJson.data;

        this.setState({
          isLoading: false,
          currentQuery: this.state.searchText,
          resultsCount: responseJson.count,
          synonyms: responseJson.synonyms,
          pageNum: this.state.pageNum + 1, // we've moved ahead one page
          itemDataSrc: this.ds.cloneWithRows(this._data)
        });
      });
  }

  onRowClicked(d) {
    this.props.navigator.push({
      title: "Details",
      screen: "brca.DetailScreen",
      passProps: {
        data: d
      }
    });
  }

  onEndReached () {
    // check if there's anything left to request
    if (this.state.pageNum * this.state.pageSize < this.state.resultsCount) {
      // there is, so load it up!
      this.setState({
        isLoading: true
      });

      this.getItemsForQuery(this.state.currentQuery, this.state.pageSize, this.state.pageNum, 'poll')
        .then((responseJson) => {
          // we append this new data to the existing collection for rebinding
          this._data = this._data.concat(responseJson.data);

          this.setState({
            isLoading: false,
            pageNum: this.state.pageNum + 1, // we've moved ahead one page
            itemDataSrc: this.ds.cloneWithRows(this._data)
          });
        });
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SearchBar
          style={{flex: 0}}
          text={this.state.searchText}
          autoFocus={true}
          onChangeText={this.onChangeText.bind(this)}
          onSubmit={this.onSubmit.bind(this)} />

        <View style={{flex: 1}}>
          <ResultsTable
            pageNum={this.state.pageNum}
            pageSize={this.state.pageSize}
            resultsCount={this.state.resultsCount}
            synonyms={this.state.synonyms}
            dataSource={this.state.itemDataSrc}
            isLoading={this.state.isLoading}
            onRowClicked={this.onRowClicked.bind(this)}
            onEndReached={this.onEndReached.bind(this)} />
        </View>
      </View>
    )
  }

  //
  // utility methods for fetching
  //

  encodeParams(params) {
    var esc = encodeURIComponent;
    return Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
  }

  getItemsForQuery(query, page_size, page_num, tag) {
    page_size = (page_size === null)?10:page_size;
    page_num = (page_num === null)?0:page_num
    tag = (tag === null)?'n/a':tag;

    var args = {
      format: 'json',
      search_term: query,
      page_size: page_size,
      page_num: page_num
    };

    var queryString = 'http://brcaexchange.org/backend/data/?' + this.encodeParams(args);
    console.log("Request [" + tag + "]: ", queryString);

    return fetch(queryString)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

const styles = StyleSheet.create({
  // moved to child classes
});
