import React, {Component} from 'react';
import {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Platform
} from 'react-native';

export default class DetailDisplay extends Component {
    constructor(props) {
        super(props);
    }

    // utility method to combine [[1,2,3],[4,5,6]] into [[1,4],[2,5],[3,6]]
    zip(rows) {
      return rows[0].map((_,c)=>rows.map(row=>row[c]));
    }

    renderRow(d) {
        return (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{d[0]}</Text>
              <Text style={styles.rowValue}>{d[1]}</Text>
            </View>
        );
    }

    // produces a series of listview-displayable rows from a variant data object
    dataToSource(d) {
      // FIXME: should this be in state? probably not
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return ds.cloneWithRows(this.zip([Object.keys(d), Object.values(d)]))
    }

    render() {
      return (
          <View>
            <Text style={styles.title}>Variant Detail</Text>
            <ListView
              style={styles.listContainer}
              enableEmptySections={true}
              dataSource={this.dataToSource(this.props.data)}
              renderRow={this.renderRow.bind(this)} />
          </View>

      );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        marginTop: 0,
        borderWidth: 1,
        borderColor: '#aaa'
    },
    title: {
      alignSelf: 'center',
      fontSize: 32,
      fontWeight: '500',
      marginBottom: 40
    },
    row: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#aaa'
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '500'
    },
    rowValue: {
        padding: 8,
        fontSize: 16
    }
});
