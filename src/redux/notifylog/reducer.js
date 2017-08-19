import {
    MARK_VISIBLE_READ,
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
                    read: false,
                    ...action.notification
                }),
            });

        case MARK_VISIBLE_READ:
            return state.merge({
                notifications: state.get('notifications').map(x => {
                    x.read = true;
                    return x;
                }),
            });

        default:
            return state;
    }
}
