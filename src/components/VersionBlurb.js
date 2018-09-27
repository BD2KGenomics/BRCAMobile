import React, {Component} from 'react';
import {connect} from "react-redux";
import debounce from 'lodash/debounce';
import {Text, TouchableOpacity, StyleSheet} from "react-native";
import Toast from 'react-native-simple-toast';
import { version } from '../../package.json';

import {set_debugging} from "../redux/debugging/actions";

const DEBUG_TOGGLE_CLICKS = 5; // number of times to click the version to toggle debugging
const DEBUG_TOGGLE_DELAY = 800; // max time in msec between taps

class VersionBlurb extends Component {
    constructor(props) {
        super(props);
        this.clicks = 0;

        this.onTappedVersion = this.onTappedVersion.bind(this);
        this.elapseDebugChange = debounce(this.elapseDebugChange.bind(this), DEBUG_TOGGLE_DELAY, {
            leading: true,
            trailing: true
        });
    }

    elapseDebugChange() {
        this.clicks = 0;
    }

    onTappedVersion() {
        // we only allow them to enable debugging from here; they should disable it from the debug page itself
        if (this.props.isDebugging) {
            return;
        }

        // debounced, so it will trigger only after DEBUG_TOGGLE_DELAY elapses
        // it will postpone execution by DEBUG_TOGGLE_DELAY ms each time the version text is tapped
        this.elapseDebugChange();
        this.clicks += 1;

        if (this.clicks >= DEBUG_TOGGLE_CLICKS) {
            this.props.onSetDebugging(true);
            this.clicks = 0;
            Toast.show(`Debug mode enabled`);
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onTappedVersion}>
                <Text style={styles.version}>brca-exchange mobile v{ version }</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    version: {
        flex: 0,
        width: 260,
        borderTopColor: '#777',
        borderTopWidth: 1,
        paddingTop: 10,
        marginBottom: 20,
        color: '#888',
        fontSize: 15,
        textAlign: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        isDebugging: state.debugging.isDebugging
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        onSetDebugging: (isDebugging) => {
            dispatch(set_debugging(isDebugging))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VersionBlurb);