import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

// credit to https://stackoverflow.com/a/34779467 (some modifications made, no longer an HOC)

export default (props) => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {props.children}
        </TouchableWithoutFeedback>
    );
};
