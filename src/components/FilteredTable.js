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

class FilteredTable extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({
            // FIXME: this is hugely inefficient. actually check if we've had a subscription change
            rowHasChanged: (r1, r2) => true
        });

        this.state = {
            searchText: this.props.initialText,
            dataSource: this.ds.cloneWithRows(props.variants)
        };
    }

    componentWillReceiveProps(newProps) {
        console.log("Collection is rebinding!");

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newProps.variants)
        });
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
                data: d
            }
        });
    }

    onEndReached() {
        console.log("Attempting to pull more results: ", this.props.query);

        if (this.props.query !== null && !this.props.isLoading) {
            this.props.onFetchNextPage();
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
                        pageSize={this.props.pageSize}
                        subscriptions={this.props.subscriptions}
                        resultsCount={this.props.resultsCount}
                        synonyms={this.props.synonyms}
                        dataSource={this.state.dataSource}
                        isLoading={this.props.isLoading}
                        onRowClicked={this.onRowClicked.bind(this)}
                        onEndReached={this.onEndReached.bind(this)} />
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
    return {
        // subscription info
        subscriptions: state.brca.subscriptions,
        // query info
        isLoading: state.brca.isFetching,
        query: state.brca.query,
        variants: state.brca.variants,
        synonyms: state.brca.synonyms,
        resultsCount: state.brca.totalResults,
        pageIndex: state.brca.pageIndex,
        pageSize: state.brca.pageSize
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