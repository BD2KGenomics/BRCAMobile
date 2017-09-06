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

export function observe_notification(notification) {
    return function (dispatch, getState) {
        // if we're subscribed to it
    }
}