import PropTypes from 'prop-types';
/**
 * Created by Faisal on 7/15/17.
 */

import React, {Component} from 'react';
import {
    Modal, Text, TouchableOpacity, View, Button,
    StyleSheet
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ResultsTable from './ResultsTable';

export default class LegendModal extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        showLegend: PropTypes.bool.isRequired,
        onDismissLegend: PropTypes.func.isRequired
    };

    render() {
        return (<Modal visible={this.props.showLegend}
            transparent={true}
            onRequestClose={() => this.props.onDismissLegend()}
            animationType="fade">

            {/*backgroundColor: 'rgba(0,0,0,0.25)'*/}
            <TouchableOpacity activeOpacity={1} focusedOpacity={1} style={{backgroundColor: 'rgba(0,0,0,0.25)', flexGrow: 1}} onPress={() => this.props.onDismissLegend()}>
                <View style={styles.legendModal}>
                    <View style={styles.legendModalHeader}>
                        {/*<Icon name="help" color="white" size={22} />*/}
                        <Text style={styles.legendModalTitle}>Icon Legend</Text>
                    </View>

                    <View style={{padding: 20}}>
                        <Text style={styles.subheader}>Pathogenicity:</Text>

                        {
                            Object.keys(ResultsTable.patho_indicators).map((name, idx) => {
                                const obj_style = ResultsTable.patho_indicators[name];

                                return (
                                    <View key={idx} style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 15}}>
                                        <Icon {...obj_style} size={22} />
                                        <Text style={{marginLeft: 5, marginRight: 10}}>{name}</Text>
                                    </View>
                                );
                            })
                        }

                        <Text style={styles.subheader}>Follow Status:</Text>

                        {
                            Object.keys(ResultsTable.follow_indicators).map((name, idx) => {
                                const obj_style = ResultsTable.follow_indicators[name];

                                return (
                                    <View key={idx} style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 15}}>
                                        <Icon {...obj_style} size={22} />
                                        <Text style={{marginLeft: 5, marginRight: 10}}>{name}</Text>
                                    </View>
                                );
                            })
                        }

                        <TouchableOpacity style={styles.closeModalButton} onPress={() => this.props.onDismissLegend()}>
                            <Text style={styles.closeModalButtonText}>close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>

        </Modal>)
    }
}

const styles = StyleSheet.create({
    legendModal: {
        backgroundColor: 'white',
        top: 45,
        borderColor: '#a6a6a6',
        borderWidth: 1,
        borderRadius: 3,
        padding: 0,
        margin: 30,

        shadowRadius: 5,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {x: 0, y: 10},
    },

    legendModalHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#5ca0bf',
        borderBottomColor: 'black',
        borderBottomWidth: 3,
        margin: 0,
        padding: 10,
    },

    legendModalTitle: {
        fontWeight: '800',
        fontSize: 24,
        textAlign: 'center',
        color: 'black',
        marginLeft: 10
    },

    subheader: {
        fontWeight: '800',
        marginTop: 5,
        marginBottom: 10
    },

    closeModalButton: {
        marginTop: 10,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#6fa4e8',
        borderRadius: 5
    },
    closeModalButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    }
});
