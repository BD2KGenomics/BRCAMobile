import {
    Platform, DeviceEventEmitter
} from 'react-native';
import FCM, {
    FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType
} from "react-native-fcm";

// ---------------------------------------
// --- notification buffering
// ---------------------------------------

export class BufferNotifyManager {
    constructor(opts) {
        this.duration = opts.duration || 2000;

        // for buffering notifications (i.e. to show one 'batched' notification if we receive many)
        this.bufferNotify = this.bufferNotify.bind(this);
        this.releaseBuffer = this.releaseBuffer.bind(this);
        this.buffered_notifies = [];
        this.buffer_handler = -1;
    }

    bufferNotify(notif) {
        this.buffered_notifies = this.buffered_notifies.concat(notif);

        if (this.buffer_handler >= 0) {
            clearTimeout(this.buffer_handler);
        }

        this.buffer_handler = setTimeout(this.releaseBuffer, this.duration);
    }

    releaseBuffer() {
        // console.log("Notifies: ", this.buffered_notifies);

        // fire off either a single detailed notification, or a batched notify if length > 1
        if (this.buffered_notifies.length == 1) {
            showSingleNotification(this.buffered_notifies[0]);
        }
        else {
            showBatchedNotification(this.buffered_notifies);
        }

        // and clear all this for next time
        this.buffer_handler = -1;
        this.buffered_notifies = [];
    }


    // ---------------------------------------
    // --- actual notification displaying
    // ---------------------------------------
}

// helper methods for formatting notifications

function showBatchedNotification(buffered_notifies) {
    // show batched notification
    FCM.presentLocalNotification({
        opened_from_tray: 0,
        priority: "high",
        icon: "ic_stat_brca_notify",
        title: `${buffered_notifies.length} variants have changed`,
        body: `The clinical significance of ${buffered_notifies.length} variants have changed`,
        variant_count: buffered_notifies.length,
        announcement: true,
        click_action: (Platform.OS === "android") ? "fcm.ACTION.HELLO" : buffered_notifies[0].click_action,
        show_in_foreground: true,
        local: true
    });
}

function showSingleNotification(notif) {
    // console.log("Showing: ", notif);

    FCM.presentLocalNotification({
        opened_from_tray: 0,
        priority: "high",
        icon: "ic_stat_brca_notify",
        title: notif.title,
        body: notif.body,
        variant_id: notif.variant_id,
        variant_count: 1,
        announcement: true, // makes the notify handler go to the notifylog vs. the details view
        click_action: (Platform.OS === "android") ? "fcm.ACTION.HELLO" : notif.click_action,
        show_in_foreground: true,
        local: true
    });
}

export function announceBatchedNotifies(notifies) {
    // fire off either a single detailed notification, or a batched notify if length > 1
    if (notifies.length == 1) {
        showSingleNotification(notifies[0]);
    }
    else if (notifies.length > 0) {
        showBatchedNotification(notifies);
    }
}
