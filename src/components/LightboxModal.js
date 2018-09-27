import React, {Component} from 'react';
import {
    Modal, View,
    StyleSheet, SafeAreaView, Text
} from "react-native";
import PropTypes from 'prop-types';

export default class LightboxModal extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onDismiss: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        closingDismisses: PropTypes.bool
    };

    static defaultProps = {
        closingDismisses: true
    };

    render() {
        return (
            <Modal visible={this.props.visible}
                transparent={true}
                onRequestClose={() => this.props.closingDismisses ? this.props.onDismiss() : this.props.onCancel()}
                supportedOrientations={['portrait', 'landscape']}
                animationType="fade">

                <View style={styles.lightbox}>
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                        <View style={styles.legendModal}>
                        {
                            this.props.title && (
                                <View style={styles.legendModalHeader}>
                                    <Text style={styles.legendModalTitle}>{this.props.title}</Text>
                                </View>
                            )
                        }

                        {this.props.children}
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    lightbox: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        flex: 1,
        flexDirection: 'row',
        padding: 20
    },
    legendModal: {
        backgroundColor: 'white',

        // maxWidth: 500,
        marginTop: 40,
        marginBottom: 40,

        borderColor: '#a6a6a6',
        borderWidth: 1,
        borderRadius: 5,

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
        fontSize: 20,
        textAlign: 'center',
        color: 'black',
        marginLeft: 10
    },
});
