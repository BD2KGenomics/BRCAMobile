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
    ActivityIndicator,
    StyleSheet,
    Alert,
    Platform
} from 'react-native';
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';

import { subscribe, unsubscribe } from '../redux/actions';

import SubscribeButton from './SubscribeButton';

import {columns} from '../metadata/fields';

class DetailDisplay extends Component {
    constructor(props) {
        super(props);
    }

    static renderRow(d, sectionID, rowID) {
        return (
            <View style={[styles.row, (rowID % 2 == 1?styles.oddRow:null)]}>
                <Text style={styles.rowLabel}>{d.title}</Text>
                <Text style={styles.rowValue}>{d.value}</Text>
            </View>
        );
    }

    toggleSubscription() {
        // holdover from relying on props before
        const d = this.props.data;
        const identifier = d.HGVS_cDNA.split(':')[1];

        if (!this.isSubscribed()) {
            this.props.onSubscribe(d);
            Toast.show('Subscribed to ' + identifier, 1);
        } else {
            this.props.onUnsubscribe(d);
            Toast.show('Unsubscribed from ' + identifier, 1);
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
            return { title: x.title, value: (x.render)?x.render(v):v };
        });

        return ds.cloneWithRows(rows);
    }

    isSubscribed() {
        return this.props.subscriptions.hasOwnProperty(this.props.data.id);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text style={styles.title}>Variant Detail</Text>

                <View style={styles.subscribeToggleContainer}>
                    <SubscribeButton
                        subscribed={this.isSubscribed()}
                        onSubscriptionChanged={this.toggleSubscription.bind(this)}
                    />
                </View>

                <ListView style={styles.listContainer}
                          enableEmptySections={true}
                          dataSource={this.dataToSource(this.props.data)}
                          renderRow={DetailDisplay.renderRow.bind(this)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    listContainer: {
        marginTop: 0,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#aaa'
    },
    title: {
        alignSelf: 'center',
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
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#aaa'
    },
    oddRow: {
        backgroundColor: '#eee'
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

/* define the component-to-store connectors */

const mapStateToProps = (state) => {
    return {
        // subscription info
        subscriptions: state.brca.subscriptions
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        onSubscribe: (item_id) => {
            dispatch(subscribe(item_id))
        },
        onUnsubscribe: (item_id) => {
            dispatch(unsubscribe(item_id))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailDisplay);
