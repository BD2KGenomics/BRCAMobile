import React, {Component} from 'react';
import {
    Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity, ActivityIndicator,
    Dimensions,
    StyleSheet, Alert, Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ScrollTopView from 'react-native-scrolltotop';

export default class ResultsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isNotAtTop: false
        }
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

    static patho_indicators = {
        'Pathogenic': {color: '#e7b34e', name: 'group-work'},
        'Benign / Little Clinical Significance': {color: '#7ad6ff', name: 'check-circle'},
        'Not Yet Classified': {color: '#eee', name: 'fiber-manual-record'},
        'Not Yet Reviewed': {color: '#eee', name: 'fiber-manual-record'}
    };

    renderRow(d) {
        return (
            <TouchableOpacity onPress={this.rowClicked.bind(this, d)}>
              <View style={styles.row}>
                <Text style={[styles.rowCell, styles.rowTextCell, {flex: 0.3}]}>{d.Gene_Symbol}</Text>
                <Text style={[styles.rowCell, styles.rowTextCell]}>{d.HGVS_cDNA.split(':')[1]}</Text>
                <View style={[styles.rowCell, { flex: 0.25, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'nowrap' }]}>
                    <Icon {...ResultsTable.patho_indicators[d.Pathogenicity_expert]} size={22} />

                    { this.props.subscriptions.hasOwnProperty(d.id) ? <Icon name="bookmark" color="#555" size={22} /> : <Icon name="bookmark-border" color="#eee" size={22} /> }
                </View>
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
                    ref="listview"
                    style={styles.listContainer}
                    enableEmptySections={true}
                    pageSize={this.props.pageSize}
                    dataSource={this.props.dataSource}
                    onEndReached={this.props.onEndReached}
                    // renderHeader={this.renderHeader.bind(this)}
                    renderRow={this.renderRow.bind(this)}
                    renderFooter={this.renderFooter.bind(this)}
                    onScroll={this._onScroll.bind(this)}
                />

                { this.state.isNotAtTop ?
                    <ScrollTopView root={this}
                        top={Dimensions.get('window').height - 220}
                        left={Dimensions.get('window').width - 100} /> : null
                }
            </View>

        );
    }

    _onScroll(e) {
        this.setState({
            isNotAtTop: (e.nativeEvent.contentOffset.y > 100)
        });
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
