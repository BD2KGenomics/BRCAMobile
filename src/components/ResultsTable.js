import React, {Component} from 'react';
import {
    Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity, ActivityIndicator,
    StyleSheet, Alert, Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

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
              <Text style={styles.headerCell}>HGVS Nucleotide</Text>
            </View>
        )
    }

    renderRow(d) {
        /*
        if (this.props.subscriptions.hasOwnProperty(d.id)) {
            console.log(d.id + " subscribed!");
        }
        */

        return (
            <TouchableOpacity onPress={this.rowClicked.bind(this, d)}>
              <View style={styles.row}>
                <Text style={[styles.rowCell, styles.rowTextCell, {flex: 0.3}]}>{d.Gene_Symbol}</Text>
                <Text style={[styles.rowCell, styles.rowTextCell]}>{d.HGVS_cDNA.split(':')[1]}</Text>
                <View style={[styles.rowCell, { flex: 0 }]}>{
                    this.props.subscriptions.hasOwnProperty(d.id) ?
                        <Icon name="check" size={22} /> : null
                }</View>
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
                {this.props.resultsCount > 0 ?
                    <Text>
                        loaded {this.props.dataSource.getRowCount()} out of {this.props.resultsCount} matching
                        variants&nbsp;
                        { (this.props.synonyms > 0) ? <Text>(synonyms: {this.props.synonyms})</Text> : '' }
                    </Text> : (this.props.isLoading ? <Text>loading...</Text> : null)
                }

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
    },
    rowTextCell: {
        fontSize: 16
    },
    rowCellKlein: {
        flex: 0,
        padding: 8,
        fontSize: 16
    }
});
