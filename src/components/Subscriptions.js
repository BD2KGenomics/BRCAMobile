import React, {Component} from 'react';
import {
    Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity, ActivityIndicator,
    StyleSheet, Alert, Platform
} from 'react-native';

import SubscribeButton from './AnimatedSubscribeButton';
import {ensureNonImmutable} from "../toolbox/misc";

export default class Subscriptions extends Component {
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({
            // FIXME: this is hugely inefficient. actually check if we've had a subscription change
            rowHasChanged: (r1, r2) => true
        });

        // convert subs to a JS object to bind it to a list
        const subscriptions_js = ensureNonImmutable(props.subscriptions);
        const currentSubs = Object.values(subscriptions_js);

        this.state = {
            originalSet: Object.assign({}, currentSubs),
            dataSource: this.ds.cloneWithRows(currentSubs)
        };
    }

    componentWillReceiveProps(newProps) {
        // this is kind of silly, but the list won't refresh unless we feed it data it can't be sure hasn't changed
        // since we keep the list frozen, but update subscribing, this is a quick hack to get the buttons to redraw
        // FIXME: is there a better way to do this?

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.originalSet)
        });
    }

    rowClicked(d) {
        if (this.props.onRowClicked) {
            this.props.onRowClicked(d);
        }
    }

    subscribeClicked(d) {
        if (this.props.onSubscribeClicked) {
            this.props.onSubscribeClicked(d);
        }
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                {/*<Text style={[styles.headerCell, {flex: 0.4}]}>Gene</Text>*/}
                <Text style={styles.headerCell} numberOfLines={1}>HGVS Nucl.</Text>
                <Text style={[styles.headerCell, { textAlign: 'right' }]}>Status</Text>
            </View>
        )
    }

    renderRow(d) {
        // this checks the subscribing list directly vs. the frozen dataset we're manipulating
        const subscribed = this.props.subscriptions.has(d['Genomic_Coordinate_hg38']);
        console.log("sub render: ", d);

        return (
            <TouchableOpacity onPress={this.rowClicked.bind(this, d)}>
                <View style={styles.row}>
                    {/*<Text style={[styles.rowCell, (subscribed)?styles.subscribed:null, {flex: 0.4}]}>{d.Gene_Symbol}</Text>*/}
                    <Text style={styles.rowCell} ellipsizeMode="tail" numberOfLines={1}>{d.HGVS_cDNA.split(':')[1]}</Text>
                    <View style={styles.rowCellSubscribe}>
                        <SubscribeButton
                            subscribed={subscribed}
                            activeScreen="subscriptions"
                            subsLastUpdatedBy={this.props.subsLastUpdatedBy}
                            abbreviated={true}
                            onSubscriptionChanged={this.subscribeClicked.bind(this, d)}
                            />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View>
                <View style={styles.headerContainer}>
                    {this.renderHeader()}
                </View>

                <ListView
                    style={styles.listContainer}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    // renderHeader={this.renderHeader.bind(this)}
                    renderRow={this.renderRow.bind(this)}
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
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16
    },
    rowCellSubscribe: {
        padding: 4
    },
    rowCellKlein: {
        flex: 0,
        padding: 8,
        fontSize: 14
    },
    subscribed: {
        fontWeight: '600'
    }
});
