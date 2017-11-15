import {
    MARK_NOTIFICATION_READ,
    MARK_VISIBLE_READ, ARCHIVE_ALL_NOTIFICATIONS,
    RECEIVE_NOTIFICATION, SET_NEXTCHECK_TIME, SET_UPDATED_TO_VERSION, CLEAR_ALL_NOTIFICATIONS, DEBUG_PURGE_NOTIFYSTATE
} from './actions';
import * as Immutable from "immutable";

const initialState = {
    notifications: Immutable.List(),
    nextCheck: null, // min time to check for a new release, in milliseconds since the epoch
    latestVersion: null, // database version since last successful fetch
    updatedAt: null, // the time that we completed the update
};

export default function notifylogReducer(state=initialState, action) {
    switch (action.type) {
        case SET_NEXTCHECK_TIME:
            return Object.assign({}, state, {
                nextCheck: action.nextCheck
            });

        case SET_UPDATED_TO_VERSION:
            return Object.assign({}, state, {
                latestVersion: action.latestVersion,
                updatedAt: new Date()
            });

        case RECEIVE_NOTIFICATION:
            return Object.assign({}, state, {
                notifications: state.notifications.concat({
                    received_at: action.received_at,
                    read: false,
                    archived: false,
                    idx: state.notifications.size,
                    ...action.notification
                }),
            });

        case MARK_NOTIFICATION_READ:
            return Object.assign({}, state, {
                notifications: state.notifications
                    .map((x,idx) => {
                        // this is inefficient, but update isn't working as expected
                        if (idx == action.idx) {
                            x.read = true;
                        }
                        return x;
                    }),
            });

        case MARK_VISIBLE_READ:
            return Object.assign({}, state, {
                notifications: state.notifications.map(x => {
                    x.read = true;
                    return x;
                }),
            });

        case ARCHIVE_ALL_NOTIFICATIONS:
            return Object.assign({}, state, {
                notifications: state.notifications.map(x => {
                    x.archived = true;
                    return x;
                }),
            });

        case CLEAR_ALL_NOTIFICATIONS:
            return Object.assign({}, state, {
                notifications: state.notifications.clear()
            });

        case DEBUG_PURGE_NOTIFYSTATE:
            return initialState;

        default:
            return state;
    }
}
