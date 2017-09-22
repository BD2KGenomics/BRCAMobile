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
        console.log("Notifies: ", this.buffered_notifies);

        // TODO: fire off either a single detailed notification, or a batched notify if length > 1
        if (this.buffered_notifies.length == 1) {
            this.showLocalNotification(this.buffered_notifies[0]);
        }
        else {
            // TODO: show batched notification
            FCM.presentLocalNotification({
                opened_from_tray: 0,
                icon: "ic_stat_brca_notify",
                title: `${this.buffered_notifies.length} variants have changed`,
                body: `The clinical significance of ${this.buffered_notifies.length} variants have changed`,
                priority: "high",
                variant_count: this.buffered_notifies.length,
                announcement: true,
                click_action: (Platform.OS === "android") ? "fcm.ACTION.HELLO" : this.buffered_notifies[0].click_action,
                show_in_foreground: true,
                local: true
            });
        }

        // and clear all this for next time
        this.buffer_handler = -1;
        this.buffered_notifies = [];
    }


    // ---------------------------------------
    // --- actual notification displaying
    // ---------------------------------------

    showLocalNotification(notif) {
        console.log("Showing: ", notif);

        FCM.presentLocalNotification({
            opened_from_tray: 0,
            icon: "ic_stat_brca_notify",
            title: notif.title,
            body: notif.body,
            variant_id: notif.variant_id,
            priority: "high",
            click_action: (Platform.OS === "android") ? "fcm.ACTION.HELLO" : notif.click_action,
            // show_in_foreground: true,
            local: true
        });
    }
}