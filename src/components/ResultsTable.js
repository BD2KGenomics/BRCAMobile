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
import {ImmutableListView} from "react-native-immutable-list-view";

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
        this.scrollToTop = this.scrollToTop.bind(this);

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
            (d.get('subscribed') ? "Following Variant" : "Not Following Variant")
        ];

        const pathoIconProps = getIconByPathogenicity(d.get('Pathogenicity_expert'));

        return (
            <TouchableOpacity onPress={this.rowClicked.bind(this, d.toJS())}>
              <View style={styles.row}>
                <Text style={[styles.rowCell, styles.rowTextCell, {flex: 0.4}]} numberOfLines={1}>{d.get('Gene_Symbol')}</Text>
                <Text style={[styles.rowCell, styles.rowTextCell]} numberOfLines={1} ellipsizeMode="tail">{d.get('HGVS_cDNA').split(':')[1]}</Text>
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
            <View>
                {/* this.props.isLoading */}
                <ActivityIndicator style={{margin: 10}} size='large' animating={this.props.isLoading} />
            </View>
        );
    }

    render() {
        const resultsText =
            `${this.props.resultsCount} variant${this.props.resultsCount !== 1 ? 's' : ''}` +
            ((this.props.synonyms > 0) ? ` (synonyms: ${this.props.synonyms})` : '');

        return (
            <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
                <View style={{minHeight: 25, flexDirection: 'row', alignItems: 'center', paddingLeft: 5}}>
                    <View style={{flexGrow: 1}}>
                    {
                        this.props.resultsCount > 0 ?
                            <Text>{resultsText}</Text>
                            :
                            (this.props.isLoading ? <Text>loading...</Text> : <Text>no results found</Text>)
                    }
                    </View>

                    {/* loaded {this.props.dataSource.getRowCount()} out of */}
                    {/*
                    {this.props.resultsCount} variant{this.props.resultsCount !== 1 && 's'}&nbsp;
                    ${ (this.props.synonyms > 0) ? <Text>(synonyms: {this.props.synonyms})</Text> : '' }
                    */}

                    <View>
                        <Icon.Button {...ResultsTable.legendProps} name="help" onPress={() => this.showLegend()}>
                            <Text style={{fontSize: 13, color: 'white', fontWeight: '600', marginRight: 5}}>legend</Text>
                        </Icon.Button>
                    </View>
                </View>

                <View style={styles.headerContainer}>
                    {this.renderHeader()}
                </View>

                {/*
                <VirtualizedList
                    ref="listview"
                    style={styles.listContainer}
                    data={this.props.variants}
                    extraData={this.props.isLoading}
                    onEndReached={this.props.onEndReached}

                    getItem={(data, index) => data.get(index)}
                    getItemCount={(data) => data.size}
                    getItemLayout={(data, index) => ({length: 39, offset: 0, index})}
                    keyExtractor={(item) => item.id}

                    renderItem={this.renderItem}
                    ListFooterComponent={this.renderFooter}
                    onScroll={this._onScroll}
                />
                */}

                <ImmutableListView
                    ref="listview"
                    style={styles.listContainer}
                    immutableData={this.props.variants}

                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    renderEmptyInList={null}

                    onEndReached={this.props.onEndReached}
                    onScroll={this._onScroll}
                />


                { this.state.isNotAtTop &&
                    <ScrollTopView root={this}
                        onPress={this.scrollToTop}
                        top={Dimensions.get('window').height - 240}
                        left={Dimensions.get('window').width - 100}
                    />
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

    scrollToTop() {
        // this.refs.listview.scrollToOffset({ offset: 0 });
        this.refs.listview.scrollTo({ x: 0, y: 0, animated: true });
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
        flexGrow: 1
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
