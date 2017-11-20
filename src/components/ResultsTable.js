import React, {Component} from 'react';
import {
    Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity, ActivityIndicator,
    Dimensions,
    StyleSheet, Alert, Platform, Modal, Button, TouchableWithoutFeedback, VirtualizedList
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ScrollTopView from './3rdparty/ScrollTopView';

import {follow_indicators, getIconByPathogenicity, patho_indicators} from "../metadata/icons";
import LegendModal from "./LegendModal";

export default class ResultsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isNotAtTop: false,
            showLegend: false
        };

        // bind local methods (consider changing to es7 members)
        this.rowClicked = this.rowClicked.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this.showLegend = this.showLegend.bind(this);
        this.dismissLegend = this.dismissLegend.bind(this);
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

    static legendProps = {
        size: 15,
        color: "white",
        padding: 5,
        borderRadius: 15,
        backgroundColor: "#777",
        underlayColor: "white",
        iconStyle: { marginRight: 5 }
    };

    renderRow(d) {
        // get style for the following/not following icon column
        const followIconProps = follow_indicators[
            (this.props.subscriptions.has(d['Genomic_Coordinate_hg38']) ? "Following Variant" : "Not Following Variant")
        ];

        const pathoIconProps = getIconByPathogenicity(d.Pathogenicity_expert);

        return (
            <TouchableOpacity onPress={this.rowClicked.bind(this, d)}>
              <View style={styles.row}>
                <Text style={[styles.rowCell, styles.rowTextCell, {flex: 0.4}]} numberOfLines={1}>{d.Gene_Symbol}</Text>
                <Text style={[styles.rowCell, styles.rowTextCell]} numberOfLines={1} ellipsizeMode="tail">{d.HGVS_cDNA.split(':')[1]}</Text>
                <View style={[styles.rowCell, { flex: 0.25, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'nowrap' }]}>
                    <Icon {...pathoIconProps} size={22} />
                    <Icon {...followIconProps} size={22} />
                </View>
              </View>
            </TouchableOpacity>
        );
    }

    renderItem({ item }) {
        return this.renderRow(item);
    }

    renderFooter() {
        return (
            <ActivityIndicator style={{margin: 10}} size='large' animating={this.props.isLoading} />
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
                    <View style={{minHeight: 25, flexDirection: 'row', alignItems: 'center', paddingLeft: 5}}>
                        <View style={{flexGrow: 1}}>
                        {
                            this.props.resultsCount > 0 ?
                                <Text>
                                    {/* loaded {this.props.dataSource.getRowCount()} out of */}
                                    {this.props.resultsCount} variant{this.props.resultsCount !== 1 && 's'}&nbsp;
                                    { (this.props.synonyms > 0) ? <Text>(synonyms: {this.props.synonyms})</Text> : '' }
                                </Text>
                                :
                                (this.props.isLoading ? <Text>loading...</Text> : <Text>no results found</Text>)
                        }
                        </View>

                        <View>
                            <Icon.Button {...ResultsTable.legendProps} name="help" onPress={() => this.showLegend()}>
                                <Text style={{fontSize: 13, color: 'white', fontWeight: '600', marginRight: 5}}>legend</Text>
                            </Icon.Button>
                        </View>
                    </View>

                    <View style={styles.headerContainer}>
                        {this.renderHeader()}
                    </View>

                    <View style={{flexGrow: 1, height: 410}}>
                        <VirtualizedList
                            ref="listview"
                            style={styles.listContainer}
                            data={this.props.variants}
                            onEndReached={this.props.onEndReached}

                            getItem={(data, index) => this.props.variants.get(index)}
                            getItemCount={(data) => data.size}
                            getItemLayout={(data, index) => ({length: 39, offset: 0, index})}
                            keyExtractor={(item) => item.id}

                            renderItem={this.renderItem}
                            ListFooterComponent={this.renderFooter}
                            onScroll={this._onScroll}
                        />

                    </View>
                </View>

                { this.state.isNotAtTop ?
                    <ScrollTopView root={this}
                        onPress={() => this.refs.listview.scrollToOffset({ offset: 0 })}
                        top={Dimensions.get('window').height - 240}
                        left={Dimensions.get('window').width - 100} /> : null
                }

                <LegendModal showLegend={this.state.showLegend} onDismissLegend={this.dismissLegend} />
            </View>

        );
    }

    _onScroll(e) {
        this.setState({
            isNotAtTop: (e.nativeEvent.contentOffset.y > 100)
        });
    }

    showLegend() {
        this.setState({
            showLegend: true
        });
    }

    dismissLegend() {
        this.setState({
            showLegend: false
        });
    }
}

const styles = StyleSheet.create({
    listContainer: {
        marginTop: 0,
        // backgroundColor: 'lightgreen'
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
        textAlign: 'left',
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
        minHeight: 30,
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
    },

    // legend: {
    //     minHeight: 40,
    //     borderTopWidth: 1,
    //     borderTopColor: '#aaa'
    // }
});
