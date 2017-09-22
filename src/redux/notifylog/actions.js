import {
    Platform, DeviceEventEmitter
} from 'react-native';
import FCM from "react-native-fcm";

import {purge_details} from "../browsing/actions";
import {BufferNotifyManager} from "./helpers";

export const RECEIVE_NOTIFICATION = 'RECEIVE_NOTIFICATION';
export const MARK_NOTIFICATION_READ = 'MARK_NOTIFICATION_READ';
export const MARK_VISIBLE_READ = 'MARK_VISIBLE_READ';
export const ARCHIVE_ALL_NOTIFICATIONS = 'ARCHIVE_ALL_NOTIFICATIONS';

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

// some ephemeral state for deferred notifies
const notifybuffer_mgr = new BufferNotifyManager({ duration: 3000 });

export function announce_notification(notif) {
    return function (dispatch, getState) {
        // this will add the message to a queue, releasing it after some duration
        notifybuffer_mgr.bufferNotify(notif);

        /*
        FCM.presentLocalNotification({
            opened_from_tray: 0,
            icon: "ic_stat_brca_notify",
            title: notif.title,
            body: notif.body,
            variant_id: notif.variant_id,
            priority: "high",
            click_action: (Platform.OS === "android") ? "fcm.ACTION.HELLO" : notif.click_action,
            show_in_foreground: true,
            // local: true
        });

        console.log(`Announced ${notif.title}?`)
        */
    }
}

/***
 * Checks if an FCM push notification is in our subscription list, and if so passes it on
 * to store via receive_notification. Also does some bookkeeping regarding clearing the details
 * cache of the newly-updated variant and
 * @param notif the notification received from FCM
 * @returns {Function} a thunk that dispatches receive_notification if notif in sub list
 */
export function observe_notification(notif) {
    return function (dispatch, getState) {
        // if we're subscribed, re-raise a receive_notification message
        const subscriptions = getState().getIn(['subscribing','subscriptions']).keySeq();

        // it's probably from FCM, let's raise a notification if we're actually subscribed to this
        if (subscriptions.includes(notif.genome_id)) {
            console.log("* FCM notification for subscribed variant, raising local notification...");

            // log the notification
            dispatch(receive_notification(notif));
            // purge the details cache of this record, if it exists, forcing a remote refresh
            dispatch(purge_details(notif.variant_id));

            // FIXME: figure out how to raise a delayed rolled-up notif
            dispatch(announce_notification(notif));

            // this.showLocalNotification(notif);
            // this.bufferNotifications(notif);
        }
        else {
            console.log("(?!) Received notification for unsubscribed variant: ", notif.genome_id);
            console.log("Subscriptions: ", JSON.stringify(subscriptions.toJS()));
        }
    }
}