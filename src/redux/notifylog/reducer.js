import {
    MARK_NOTIFICATION_READ,
    MARK_VISIBLE_READ, ARCHIVE_ALL_NOTIFICATIONS,
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
                    archived: false,
                    idx: state.get('notifications').size,
                    ...action.notification
                }),
            });

        case MARK_NOTIFICATION_READ:
            return state.merge({
                notifications: state.get('notifications')
                    .map((x,idx) => {
                        // this is inefficient, but update isn't working as expected
                        if (idx == action.idx) {
                            x.read = true;
                        }
                        return x;
                    }),
            });

        case MARK_VISIBLE_READ:
            return state.merge({
                notifications: state.get('notifications').map(x => {
                    x.read = true;
                    return x;
                }),
            });

        case ARCHIVE_ALL_NOTIFICATIONS:
            return state.merge({
                notifications: state.get('notifications').map(x => {
                    x.archived = true;
                    return x;
                }),
            });

        default:
            return state;
    }
}
