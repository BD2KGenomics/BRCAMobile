import React, {Component} from 'react';
import {
    Text, TextInput, View, ListView, ScrollView, Image, TouchableOpacity,
    StyleSheet, Alert, Platform
} from 'react-native';
import { connect } from "react-redux";
import { Navigation } from 'react-native-navigation';
import debounce from 'lodash/debounce';

import { query_variants, fetch_next_page } from '../redux/actions';

import SearchBar from './SearchBar';
import ResultsTable from './ResultsTable';
import { Iterable } from 'immutable';

class FilteredTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: this.props.initialText
        };

        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onRowClicked = this.onRowClicked.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
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
        this.props.onQueryVariants(this.state.searchText);
    }

    onRowClicked(d) {
        this.props.navigator.push({
            title: "Details",
            screen: "brca.DetailScreen",
            passProps: {
                variant_id: d.id,
                hint: 'variants'
            }
        });
    }

    onEndReached() {
        const hasMoreRecords = this.props.variants.size < this.props.resultsCount;

        if (this.props.query !== null && !this.props.isLoading && hasMoreRecords) {
            this.props.onFetchNextPage();
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <SearchBar
                    style={{flex: 0}}
                    text={this.state.searchText}
                    autoFocus={false}
                    onChangeText={this.onChangeText}
                    onSubmit={this.onSubmit} />

                <View style={{flex: 1}}>
                    <ResultsTable
                        pageSize={this.props.pageSize}
                        subscriptions={this.props.subscriptions}
                        resultsCount={this.props.resultsCount}
                        synonyms={this.props.synonyms}
                        variants={this.props.variants_subbed}
                        isLoading={this.props.isLoading}
                        onRowClicked={this.onRowClicked}
                        onEndReached={this.onEndReached} />
                </View>
            </View>
        )
    }
}

FilteredTable.defaultProps = {
  initialText: ''
};

const styles = StyleSheet.create({
    // moved to child classes
});

/* define the component-to-store connectors */

const mapStateToProps = (state) => {
    const state_subscribing = state.subscribing;
    const state_browsing = state.browsing;

    return {
        // subscription info
        subscriptions: state_subscribing.subscriptions,
        // query info
        isLoading: state_browsing.isFetching,
        query: state_browsing.query,
        variants: state_browsing.variants,
        synonyms: state_browsing.synonyms,
        resultsCount: state_browsing.totalResults,
        pageIndex: state_browsing.pageIndex,
        pageSize: state_browsing.pageSize,

        // dynamically annotate variants with subscription state
        variants_subbed: state_browsing.variants
            .map(x =>
                x.set('subscribed', state_subscribing.subscriptions.has(
                    // quick hack to deal with previous versions storing js objects, not immutablejs maps
                    // FIXME: we should ensure the state is well-formed at hydration
                    Iterable.isIterable(x)
                        ? x.get('Genomic_Coordinate_hg38')
                        : x['Genomic_Coordinate_hg38']
                ))
            )
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        onQueryVariants: (query) => {
            dispatch(query_variants(query))
        },
        onFetchNextPage: (id) => {
            dispatch(fetch_next_page())
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilteredTable);
