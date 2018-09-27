import PropTypes from 'prop-types';
/**
 * Created by Faisal on 7/15/17.
 */

import React, {Component} from 'react';
import {
    Modal, Text, TouchableOpacity, View, Button,
    StyleSheet, ScrollView, SafeAreaView, Dimensions
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

import {follow_indicators, patho_indicators} from "../metadata/icons";
import LightboxModal from "./LightboxModal";

export default class LegendModal extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        showLegend: PropTypes.bool.isRequired,
        onDismissLegend: PropTypes.func.isRequired
    };

    render() {
        const {showLegend, onDismissLegend} = this.props;

        return (
            <LightboxModal visible={showLegend} onDismiss={onDismissLegend} onCancel={onDismissLegend} title="Icon Legend">
                <ScrollView style={{flex: 1, flexShrink: 0, padding: 20, marginBottom: 20, maxWidth: 560, maxHeight: 370}}>
                    <Text style={styles.subheader}>Pathogenicity:</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        Object.keys(patho_indicators).map((name, idx) => {
                            const obj_style = patho_indicators[name];

                            return (
                                <View key={idx} style={{minWidth: 260, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 15}}>
                                    <Icon {...obj_style} size={22} />
                                    <Text style={{marginLeft: 5, marginRight: 10}}>{ obj_style.title || name }</Text>
                                </View>
                            );
                        })
                    }
                    </View>

                    <Text style={styles.subheader}>Follow Status:</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        Object.keys(follow_indicators).map((name, idx) => {
                            const obj_style = follow_indicators[name];

                            return (
                                <View key={idx} style={{minWidth: 260, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 15}}>
                                    <Icon {...obj_style} size={22} />
                                    <Text style={{marginLeft: 5, marginRight: 10}}>{name}</Text>
                                </View>
                            );
                        })
                    }
                    </View>

                    <Text>{' '}</Text>
                </ScrollView>

                <View style={{padding: 20, paddingTop: 10, borderTopColor: "#eee", borderTopWidth: 1}}>
                    <TouchableOpacity style={styles.closeModalButton} onPress={() => this.props.onDismissLegend()}>
                        <Text style={styles.closeModalButtonText}>close</Text>
                    </TouchableOpacity>
                </View>
            </LightboxModal>
        );
    }
}

const styles = StyleSheet.create({
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
