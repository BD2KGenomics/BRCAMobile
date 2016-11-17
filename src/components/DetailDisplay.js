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
import Icon from 'react-native-vector-icons/MaterialIcons';

import {columns} from '../metadata/fields';

export default class DetailDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subscribed: false
        };
    }

    static subscriptionProps = {
        subscribed: {
            backgroundColor: '#e7b34e',
            name: 'bookmark-border' // clear
        },
        unsubscribed: {
            backgroundColor: '#63c477',
            name: 'bookmark' // check
        }
    };

    static renderRow(d, sectionID, rowID) {
        return (
            <View style={[styles.row, (rowID % 2 == 1?styles.oddRow:null)]}>
                <Text style={styles.rowLabel}>{d.title}</Text>
                <Text style={styles.rowValue}>{d.value}</Text>
            </View>
        );
    }

    toggleSubscription() {
        this.setState({
            subscribed: !this.state.subscribed
        })
    }

    // produces a series of listview-displayable rows from a variant data object
    dataToSource(d) {
        // FIXME: should this be in state? probably not
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        // converts all key/value pairs in d into [[k,v], ...]
        // (currently unused b/c we're extracting only the columns we want)
        // const v = this.zip([Object.keys(d), Object.values(d)]);

        // only extract the fields of interest (plus their readable labels)
        const rows = columns.map((x) => {
            const v = d[x.prop];
            return { title: x.title, value: (x.render)?x.render(v):v };
        });

        return ds.cloneWithRows(rows);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text style={styles.title}>Variant Detail</Text>

                <View style={styles.subscribeToggleContainer}>
                    <Icon.Button
                        {...((this.state.subscribed) ? DetailDisplay.subscriptionProps.subscribed : DetailDisplay.subscriptionProps.unsubscribed)}
                        onPress={this.toggleSubscription.bind(this)}>
                    {(this.state.subscribed)?"unsubscribe from variant":"subscribe to variant"}
                    </Icon.Button>
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
