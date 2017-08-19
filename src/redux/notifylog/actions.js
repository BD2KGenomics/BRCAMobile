export const RECEIVE_NOTIFICATION = 'RECEIVE_NOTIFICATION';
export const MARK_VISIBLE_READ = 'MARK_VISIBLE_READ';

export function receive_notification(notification) {
    return { type: RECEIVE_NOTIFICATION, received_at: new Date(), notification }
}

export function mark_visible_read() {
    return { type: MARK_VISIBLE_READ }
}
