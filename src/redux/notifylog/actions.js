import {
    Platform, DeviceEventEmitter
} from 'react-native';
import FCM from "react-native-fcm";

import {purge_details} from "../browsing/actions";
import {BufferNotifyManager} from "./helpers";

export const SET_NEXTCHECK_TIME = 'SET_NEXTCHECK_TIME';
export const SET_UPDATED_TO_VERSION = 'SET_UPDATED_TO_VERSION';

export const RECEIVE_NOTIFICATION = 'RECEIVE_NOTIFICATION';
export const MARK_NOTIFICATION_READ = 'MARK_NOTIFICATION_READ';
export const MARK_VISIBLE_READ = 'MARK_VISIBLE_READ';
export const ARCHIVE_ALL_NOTIFICATIONS = 'ARCHIVE_ALL_NOTIFICATIONS';
export const CLEAR_ALL_NOTIFICATIONS = 'CLEAR_ALL_NOTIFICATIONS';

export function set_nextcheck_time(nextCheck) {
    return { type: SET_NEXTCHECK_TIME, received_at: new Date(), nextCheck }
}

export function set_updated_to_version(latestVersion) {
    return { type: SET_UPDATED_TO_VERSION, received_at: new Date(), latestVersion }
}

export function receive_notification(notification) {
    return { type: RECEIVE_NOTIFICATION, received_at: new Date(), notification }
}

export function mark_notification_read(idx) {
    return { type: MARK_NOTIFICATION_READ, idx: idx }
}

export function mark_visible_read() {
    return { type: MARK_VISIBLE_READ }
}

export function archive_all_notifications() {
    return { type: ARCHIVE_ALL_NOTIFICATIONS }
}

export function clear_all_notifications() {
    return { type: CLEAR_ALL_NOTIFICATIONS }
}

// some ephemeral state for deferred notifies
const notifybuffer_mgr = new BufferNotifyManager({ duration: 1000 });

export function announce_notification(notif) {
    return function (dispatch, getState) {
        // this will add the message to a queue, releasing it after some duration
        notifybuffer_mgr.bufferNotify(notif);
    }
}

/***
 * Checks if an FCM push notification is in our subscription list, and if so passes it on
 * to store via receive_notification. Also does some bookkeeping regarding clearing the details
 * cache of the newly-updated variant and
 * @param notif the notification received from FCM
 * @param all_subscribed causes this method to unconditionally announce the variant, even if we're not subscribed
 * @returns {Function} a thunk that dispatches receive_notification if notif in sub list
 */
export function observe_notification(notif, all_subscribed) {
    return function (dispatch, getState) {
        // if we're subscribed, re-raise a receive_notification message
        const subscriptions = getState().getIn(['subscribing','subscriptions']).keySeq();

        // it's probably from FCM, let's raise a notification if we're actually subscribed to this
        if (all_subscribed || subscriptions.includes(notif.genome_id)) {
            // log the notification
            dispatch(receive_notification(notif));
            // purge the details cache of this record, if it exists, forcing a remote refresh
            dispatch(purge_details(notif.variant_id));

            // announces the notification with debounce, potentially displaying a batched notify if we receive more
            dispatch(announce_notification(notif));
        }
    }
}
