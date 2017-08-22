import React, {Component} from 'react';
import {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Button,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Platform,
    Clipboard
} from 'react-native';
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

import { subscribe, unsubscribe, fetch_details } from '../redux/actions';

import SubscribeButton from './AnimatedSubscribeButton';
import BRCALinkButton from "./BRCALinkButton";

import {columns} from '../metadata/fields';
import {patho_indicators} from "../metadata/icons";
import {receive_details} from "../redux/browsing/actions";

class DetailDisplay extends Component {
    constructor(props) {
        super(props);

        // FIXME: this would be so much cleaner if we depended solely on this.props.details.get(this.props.variant_id)
        // we could just check if it's there, and if it's not fire off actions to populate it from wherever
        // we could also check that we're fetching via this.props.isFetchingDetails

        // TODO: we now receive variant_id and an optional hint from our caller
        // we may need to fetch
    }

    componentDidMount() {
        // FIXME: resolve data source here
        if (!this.getTheseDetails()) {
            this.resolveDataSource(this.props.variant_id, this.props.hint);
        }
    }

    getTheseDetails() {
        return this.props.details_cache.hasOwnProperty(this.props.variant_id)
            ? this.props.details_cache[this.props.variant_id]
            : null;
    }

    resolveDataSource(variant_id, hint) {
        /*
        let source = null;
        const resolution_types = {
            subscriptions: () => {
                return this.props.subscriptions[variant_id];
            },
            variants: () => {
                const source = this.props.variants.filter(x => x.id == variant_id);
                console.log("variant source: ", source);
                return (source.length > 0) ? source[0] : null;
            },
            fetch: () => {
                // TODO: implement fetch
                return null;
            }
        };
        let resolution_order = ['subscriptions', 'variants', 'fetch'];

        // move hint to the front of the list, if present
        if (hint && resolution_order.includes(hint)) {
            resolution_order = [hint].concat(resolution_order.filter(x => x != hint))
        }

        console.log("resolution order: ", resolution_order);

        for (let i = 0; i < resolution_order.length; i++) {
            // attempt to resolve with each strategy...
            const type = resolution_order[i];
            console.log("Resolving with ", type);
            source = resolution_types[type](variant_id);

            if (source)
                break; // ...breaking if we do resolve it
        }

        // populate the details cache and let this component refresh on its own
        this.props.onReceiveDetails(this.props.variant_id, source);
        */

        // let's just kick off a fetch
        this.props.onFetchDetails(this.props.variant_id);
    }

    static renderRow(d, sectionID, rowID) {
        const v = (d.value && d.value.trim() !== '') ? d.value : '-';

        return (
            <View style={[styles.row, (rowID % 2 === 1?styles.oddRow:null)]}>
                <Text style={styles.rowLabel}>{d.title}</Text>
                { (d.field == 'Pathogenicity_expert')
                    ? renderSignificance(v)
                    : <Text selectable={true} style={styles.rowValue}>{v}</Text> }
            </View>
        );
    }

    toggleSubscription() {
        // holdover from relying on props before
        const d = this.getTheseDetails().versions[0];
        const identifier = d.HGVS_cDNA.split(':')[1];

        if (!this.isSubscribed()) {
            this.props.onSubscribe(d);
            // Toast.show('Subscribed to ' + identifier, 1);
        } else {
            this.props.onUnsubscribe(d);
            // Toast.show('Unsubscribed from ' + identifier, 1);
        }
    }

    // produces a series of listview-displayable rows from a variant data object
    dataToSource(d) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        // only extract the fields of interest (plus their readable labels)
        // note that there's a second set of columns, researchModeColumns, used in the 'all data portal' on the site
        const rows = columns.map((x) => {
            const v = d[x.prop];
            // if a render function exists, use it, otherwise just use the raw values
            return { title: x.title, field: x.prop, value: (x.render)?x.render(v):v };
        });

        return ds.cloneWithRows(rows);
    }

    isSubscribed() {
        return this.props.subscriptions.hasOwnProperty(this.props.variant_id);
    }

    versions() {
        if (!this.getTheseDetails()) {
            return (<Text>(no details cache!)</Text>);
        }

        // look up the current variant from the cache of all details views of variants
        const theseDetails = this.getTheseDetails();

        if (theseDetails) {
            return theseDetails.versions.map((x, idx) =>
                <View key={"versions-" + idx} style={versionStyles.row}>
                    <Text style={[versionStyles.rowCell, versionStyles.rowTextCell, {flex: 0.3}]}>{reformatDate(x.Data_Release.date)}</Text>
                    <Text style={[versionStyles.rowCell, versionStyles.rowTextCell, {flex: 0.7}]}>{x.Pathogenicity_expert}</Text>
                </View>
            );
        }
        else {
            // the details do exist, but they're not cached for some reason
            return (<Text>(variant not found!)</Text>);
        }
    }

    renderData(data) {
        if (!data) {
            return <View><Text>(no details?)</Text></View>;
        }

        const d = data.versions[0];

        return (
            <ScrollView style={{flex: 1}}>
                <View style={{padding: 20, paddingBottom: 0}}>
                    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">Variant{'\n'}{d.HGVS_cDNA.split(':')[1]}</Text>

                    <View style={styles.subscribeToggleContainer}>
                        <SubscribeButton
                            subscribed={this.isSubscribed()}
                            activeScreen="details"
                            subsLastUpdatedBy={this.props.subsLastUpdatedBy}
                            onSubscriptionChanged={this.toggleSubscription.bind(this)}
                        />
                    </View>
                </View>

                <ListView style={styles.listContainer}
                    enableEmptySections={true}
                    dataSource={this.dataToSource(d)}
                    renderRow={DetailDisplay.renderRow.bind(this)} />

                <View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>Version History</Text>
                    </View>

                    <View style={{padding: 10, paddingBottom: 20}}>
                        <View style={versionStyles.header}>
                            <Text style={[versionStyles.headerCell, {flex: 0.3}]}>Date</Text>
                            <Text style={[versionStyles.headerCell, {flex: 0.7}]}>Clinical Significance</Text>
                        </View>

                        {this.versions()}
                    </View>
                </View>

                <BRCALinkButton variantID={d.id} />
            </ScrollView>
        );
    }

    renderLoader() {
        return (
            <ActivityIndicator style={{margin: 10}} size='large' animating={true} />
        );
    }

    render() {
        const theseDetails = this.getTheseDetails();
        console.log("Details: ", theseDetails);

        // TODO: if we're waiting on data, display a loader
        if (!theseDetails) {
            return this.renderLoader();
        }
        else {
            return this.renderData(theseDetails);
        }
    }
}


// ------------------------------------------------------------------------------
// --- styles
// ------------------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {

    },
    listContainer: {
        marginTop: 10,
        marginBottom: 20,
        // borderWidth: 1,
        // borderColor: '#aaa'

        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#ccc'
    },
    title: {
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: '500',
        marginBottom: 20
    },
    subscribeToggleContainer: {
        marginBottom: 20,
        alignItems: 'center'
    },
    row: {
        flex: 1,
        padding: 5,
        paddingLeft: 15,
        paddingRight: 5,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    oddRow: {
        // backgroundColor: '#eee'
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '600'
    },
    rowValue: {
        padding: 8,
        fontSize: 16
    },

    sectionHeader: {
        // paddingLeft: 20,
        alignItems: 'center',
        marginBottom: 0, paddingBottom: 10,
        // borderBottomWidth: 5, borderBottomColor: 'black'
    },
    sectionHeaderText: {
        fontSize: 22,
        fontWeight: '600'
    }
});

const versionStyles = StyleSheet.create({
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
        fontWeight: '600',
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
        fontSize: 14
    },
    rowCellKlein: {
        flex: 0,
        padding: 8,
        fontSize: 16
    }
});


// ------------------------------------------------------------------------------
// --- helper methods
// ------------------------------------------------------------------------------

function isEmptyField(value) {
    if (Array.isArray(value)) {
        value = value[0];
    }

    if (value === null || (typeof value === 'undefined')) {
        return true;
    }

    const v = value.trim();
    return v === '' || v === '-' || v === 'None';
}

function reformatDate(date) { //handles single dates or an array of dates
    if (isEmptyField(date)) {
        return date;
    }
    if (!Array.isArray(date)) {
        date = date.split(',');
    }
    return date.map(function(d) {
        return moment.utc(new Date(d)).format("MMM D, YYYY");
    }).join();
}

function renderSignificance(status) {
    const pathoIconProps = (
        patho_indicators.hasOwnProperty(status)
            ? patho_indicators[status]
            : patho_indicators["Not Yet Reviewed"]
    );

    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon {...pathoIconProps} size={22} />
            <Text selectable={true} style={[styles.rowValue, {flexGrow: 1}]}>{ status }</Text>
        </View>
    );
}


// ------------------------------------------------------------------------------
// --- redux connections
// ------------------------------------------------------------------------------

const mapStateToProps = (state_immutable) => {
    const state = state_immutable.toJS();

    // FIXME: replace with reselect at some point

    return {
        // subscription info
        details_cache: state.browsing.details,
        isFetchingDetails: state.browsing.isFetchingDetails,
        variants: state.browsing.variants, // FIXME: only include this variant?
        subscriptions: state.subscribing.subscriptions,
        subsLastUpdatedBy: state.subscribing.subsLastUpdatedBy
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        onFetchDetails: (item_id) => {
            dispatch(fetch_details(item_id))
        },
        onReceiveDetails: (item_id, item) => {
            dispatch(receive_details(item_id, item))
        },
        onSubscribe: (item) => {
            dispatch(subscribe(item, 'details'))
        },
        onUnsubscribe: (item) => {
            dispatch(unsubscribe(item, 'details'))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailDisplay);
