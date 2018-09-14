import PropTypes from 'prop-types';
/**
 * Created by Faisal on 7/15/17.
 */

import React, {Component} from 'react';
import {
    Modal, Text, TouchableOpacity, View, Button,
    StyleSheet, ScrollView
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class LicenseModal extends Component {
    static propTypes = {
        showLegend: PropTypes.bool.isRequired,
        onDismissLicense: PropTypes.func.isRequired,
        onDisagreeWithLicense: PropTypes.func.isRequired
    };

    render() {
        return (
            <Modal visible={this.props.showLegend}
                transparent={true}
                onRequestClose={() => this.props.onDismissLicense()}
                supportedOrientations={['portrait', 'landscape']}
                animationType="fade">

                <View style={{ backgroundColor: 'rgba(0,0,0,0.25)', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                    <View style={styles.legendModal}>
                        <View style={styles.legendModalHeader}>
                            {/*<Icon name="help" color="white" size={22} />*/}
                            <Text style={styles.legendModalTitle}>License Agreement</Text>
                        </View>

                        <ScrollView style={{flex: 1, padding: 20, marginBottom: 20}}>
                            <Text style={styles.subheader}>Disclaimer and Data Use Policy</Text>

                            <Text style={styles.prose}>
                            Use of this app, and associated interpretation relating to gene variant pathogenicity, is subject to user discretion and responsibility. The information provided is presented with intent to educate. It is not intended to be a substitute for professional assessment of individual risk, nor for direct diagnostic use or medical decision-making without review by a genetics professional. Individuals should not change their health behavior solely on the basis of information contained on this website. The BRCA Exchange does not independently verify the submitted information. Gene variant classifications and classification methods are subject to change as further information becomes available.
                            </Text>

                            <Text style={styles.prose}>
                            The BRCA Exchange App provides a notification function for variant classification updates. This functionality uses technologies that can fail and that are beyond of the control of BRCA Exchange. This functionality should hence not be relied on for clinical decision making.
                            </Text>

                            <Text style={styles.prose}>
                            If you have questions about the information contained on this website, please see a healthcare professional.
                            </Text>

                            <Text>{' '}</Text>
                        </ScrollView>

                        <View style={{padding: 20, paddingTop: 10, borderTopColor: "#eee", borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <TouchableOpacity style={[styles.modalButton, styles.exitModalButton]} onPress={() => this.props.onDisagreeWithLicense()}>
                                <Text style={[styles.modalButtonText, styles.exitModalButtonText]}>Exit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.modalButton, styles.closeModalButton]} onPress={() => this.props.onDismissLicense()}>
                                <Text style={[styles.modalButtonText, styles.closeModalButtonText]}>I Agree</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    legendModal: {
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        bottom: 0,
        borderColor: '#a6a6a6',
        borderWidth: 1,
        borderRadius: 3,
        padding: 0,
        margin: 30,

        shadowRadius: 15,
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
        fontSize: 16,
        marginTop: 5,
        marginBottom: 10
    },

    prose: {
        lineHeight: 20,
        fontSize: 16,
        marginBottom: 10
    },

    modalButton: {
        flex: 0.45,

        marginTop: 10,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5
    },
    modalButtonText: {
        fontSize: 18,
        fontWeight: '600'
    },

    closeModalButton: {
        backgroundColor: '#6fa4e8',
    },
    closeModalButtonText: {
        color: 'white'
    },

    exitModalButton: {
        backgroundColor: '#e6e6e6',
    },
    exitModalButtonText: {
        color: 'black'
    }
});
