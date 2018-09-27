import React from "react";
import {
    Text, Linking, Alert, Image
} from 'react-native';
import {StyleSheet} from "react-native";

import Markdown from "react-native-markdown-renderer";
import Icon from 'react-native-vector-icons/MaterialIcons';

function openLink(node) {
    Alert.alert(
        'Open External Link',
        `Open link to ${node.attributes.href}?`,
        [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => {
                    console.log("Attempting to open ", node.attributes.href);
                    Linking.openURL(node.attributes.href).catch((reason) => {
                        Alert.alert("Failed to open link", reason.toString());
                    });
                } }
        ],
        { cancelable: true }
    );
}

const rules = {
    link: (node, children, parent, styles) => {
        return (
            <Text key={node.key} style={styles.link} onPress={() => openLink(node)}>
                {children}
            </Text>
        );
    },
    image: (node, children, parent, styles) => {
        let url = null;

        if(node.attributes.src.length > 0 && node.attributes.src[0] === '$'){
            return (
                <Icon key={node.key} size={22} name={node.attributes.src.substr(1)} />
            );
        }

        url = {uri: node.attributes.src};

        return (
            <Image
                indicator={true}
                key={node.key}
                style={{width: 11, height: 11}}
                source={url}
            />
        );
    }
};

export default class MarkdownProse extends React.Component {
    render() {
        return (
            <Markdown style={markdownStyles} rules={rules}>
            {this.props.children}
            </Markdown>
        );
    }
}

const markdownStyles = StyleSheet.create({
    heading: {
        marginTop: 12,
        fontWeight: 'bold'
    },
    heading1: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 0
    },
    text: {
        fontSize: 16
    },
    link: {
        color: '#2945ff',
        textDecorationLine: 'underline'
    }
});
