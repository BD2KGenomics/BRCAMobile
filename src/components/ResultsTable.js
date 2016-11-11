import React, {Component} from 'react';
import {
  Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity, ActivityIndicator,
  StyleSheet, Alert, Platform
} from 'react-native';

export default class ResultsTable extends Component {
  constructor(props) {
      super(props);
    }

    rowClicked(d) {
      if (this.props.onRowClicked) {
        this.props.onRowClicked(d);
      }
    }

    renderHeader() {
      return (
        <View style={styles.header}>
          <Text style={[styles.headerCell, {flex: 0.3}]}>Gene</Text>
          <Text style={styles.headerCell}>Source</Text>
        </View>
      )
    }

    renderRow(d) {
      return (
        <TouchableOpacity onPress={this.rowClicked.bind(this, d)}>
          <View style={styles.row}>
            <Text style={[styles.rowCell, {flex: 0.3}]}>{d.Gene_Symbol}</Text>
            <Text style={styles.rowCell}>{d.Source.split(",").join(", ")}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    renderFooter() {
      return (
        <ActivityIndicator style={{margin: 10}} size='large' animating={this.props.isLoading} />
      );
    }

    render() {
      return (
        <View>
          <Text>
            loaded {(this.props.pageNum) * this.props.pageSize} out of {this.props.resultsCount} results&nbsp;
            {(this.props.synonyms > 0)?<Text>(synonyms: {this.props.synonyms})</Text>:''}
          </Text>

          <View style={styles.headerContainer}>
          {this.renderHeader()}
          </View>

          <ListView
            style={styles.listContainer}
            enableEmptySections={true}
            pageSize={this.props.pageSize}
            dataSource={this.props.dataSource}
            onEndReached={this.props.onEndReached}
            // renderHeader={this.renderHeader.bind(this)}
            renderRow={this.renderRow.bind(this)}
            renderFooter={this.renderFooter.bind(this)}
          />
        </View>

      );
    }
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 0
  },
  headerContainer: {
    height: 38
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderBottomColor: 'black'
  },
  headerCell: {
    flex: 1,
    padding: 8,
    color: 'black',
    fontWeight: '500',
    fontSize: 16
  },
  headerCellKlein: {
    flex: 0,
    padding: 8,
    color: 'black',
    fontWeight: '500',
    fontSize: 16
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#aaa'
  },
  rowCell: {
    flex: 1,
    padding: 8,
    fontSize: 16
  },
  rowCellKlein: {
    flex: 0,
    padding: 8,
    fontSize: 16
  }
});
