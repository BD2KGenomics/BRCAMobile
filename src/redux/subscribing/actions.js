/* action types and creators */

export const SUBSCRIBE = 'SUBSCRIBE';
export const UNSUBSCRIBE = 'UNSUBSCRIBE';

export function subscribe(item, origin) {
    return { type: SUBSCRIBE, item, origin }
}

export function unsubscribe(item, origin) {
    return { type: UNSUBSCRIBE, item, origin }
}
