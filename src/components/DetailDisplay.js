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

import {columns} from '../metadata/fields';
import {patho_indicators} from "../metadata/icons";

class DetailDisplay extends Component {
    constructor(props) {
        super(props);

        this.copyCelValue = this.copyCelValue.bind(this);
    }

    componentDidMount() {
        this.props.onFetchDetails(this.props.data.id);

        // this will eventually populate this.props.details.get(this.props.data.id) with a valid value
    }

    copyCelValue(v) {
        Toast.show(`copied '${v}'`, 1);
        Clipboard.setString(v);
    }

    static renderRow(d, sectionID, rowID) {
        const v = (d.value && d.value.trim() !== '') ? d.value : '-';

        return (
            <TouchableWithoutFeedback onLongPress={() => this.copyCelValue(v)}>
                <View style={[styles.row, (rowID % 2 === 1?styles.oddRow:null)]}>
                    <Text style={styles.rowLabel}>{d.title}</Text>
                    { (d.field == 'Pathogenicity_expert')
                        ? renderSignificance(v)
                        : <Text style={styles.rowValue}>{v}</Text> }
                </View>
            </TouchableWithoutFeedback>
        );
    }

    toggleSubscription() {
        // holdover from relying on props before
        const d = this.props.data;
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
        return this.props.subscriptions.hasOwnProperty(this.props.data.id);
    }

    versions() {
        if (!this.props.details) {
            return (<Text>(no details cache!)</Text>);
        }

        // look up the current variant from the cache of all details views of variants
        const variantID = this.props.data.id;

        if (this.props.details.hasOwnProperty(variantID)) {
            return this.props.details[variantID].versions.map((x, idx) => {
                return (
                    <View key={"versions-" + idx} style={versionStyles.row}>
                        <Text style={[versionStyles.rowCell, versionStyles.rowTextCell, {flex: 0.3}]}>{reformatDate(x.Data_Release.date)}</Text>
                        <Text style={[versionStyles.rowCell, versionStyles.rowTextCell, {flex: 0.7}]}>{x.Pathogenicity_expert}</Text>
                    </View>
                );
            });
        }
        else {
            // the details do exist, but they're not cached for some reason
            return (<Text>(variant not found!)</Text>);
        }
    }

    render() {
        const d = this.props.data;

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

                {/*<View style={styles.sectionHeader}>*/}
                    {/*<Text style={styles.sectionHeaderText}>Details</Text>*/}
                {/*</View>*/}

                <ListView style={styles.listContainer}
                          enableEmptySections={true}
                          dataSource={this.dataToSource(this.props.data)}
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
            </ScrollView>
        );
    }
}

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

// helper methods

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
            <Text style={[styles.rowValue, {flexGrow: 1}]}>{ status }</Text>
        </View>
    );
}


/* define the component-to-store connectors */

const mapStateToProps = (state_immutable) => {
    const state = state_immutable.toJS();

    return {
        // subscription info
        details: state.brca.details,
        subscriptions: state.brca.subscriptions,
        subsLastUpdatedBy: state.brca.subsLastUpdatedBy
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        onFetchDetails: (item_id) => {
            dispatch(fetch_details(item_id))
        },
        onSubscribe: (item_id) => {
            dispatch(subscribe(item_id, 'details'))
        },
        onUnsubscribe: (item_id) => {
            dispatch(unsubscribe(item_id, 'details'))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailDisplay);
