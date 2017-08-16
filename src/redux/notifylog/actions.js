export const RECEIVE_NOTIFICATION = 'RECEIVE_NOTIFICATION';

export function receive_notification(notification) {
    return { type: RECEIVE_NOTIFICATION, received_at: new Date(), notification }
}
