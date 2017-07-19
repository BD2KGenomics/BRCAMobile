import React, {Component} from 'react';
import {
    Text, View, ScrollView,
    TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';

import DetailDisplay from '../components/DetailDisplay';

// FIXME: this is a hack; we should be relying on the store rather than querying directly, but alas
import {fetchDetails} from '../redux/actions';

export default class DetailScreen extends Component {
    static navigatorStyle = {
        drawUnderTabBar: true
    };

    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data || null
        };
    }

    componentDidMount() {
        // here we should check if data is null and if we have a variant_id
        // if that's the case, then we perform a lookup and feed in the result
        if (this.state.data === null && this.props.variant_id !== null) {
            // console.log("Fetching data because we weren't fed it; variant_id: ", this.props.variant_id);

            fetchDetails(this.props.variant_id).then((d) => {
                // we receive every revision sorted in reverse chronological order, so d.data[0] is the newest

                this.setState({
                    data: d.data[0]
                });
            });
        }
    }

    // FIXME: this component should deal with receiving a request for data via its variant_id prop

    render() {
        let target = <ActivityIndicator style={{margin: 10}} size='large' animating={true} />;
        if (this.state.data !== null) {
            target = (<DetailDisplay data={this.state.data} />);
        }

        return (
            <View style={styles.container}>
            { target }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: 'white'
    },
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop:10,
        color: 'blue'
    }
});
