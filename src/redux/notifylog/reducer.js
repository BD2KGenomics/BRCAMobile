import {
    RECEIVE_NOTIFICATION
} from './actions';
import * as Immutable from "immutable";

const initialState = Immutable.fromJS({
    notifications: Immutable.List(),
});

export default function notifylogReducer(state=initialState, action) {
    switch (action.type) {
        case RECEIVE_NOTIFICATION:
            return state.merge({
                notifications: state.get('notifications').concat({
                    received_at: action.received_at,
                    ...action.notification
                }),
            });

        default:
            return state;
    }
}
