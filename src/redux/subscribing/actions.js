/* action types and creators */

import {fetchDetails, queryVariantsForPage} from "./helpers";

export const SUBSCRIBE = 'SUBSCRIBE';
export const UNSUBSCRIBE = 'UNSUBSCRIBE';
export const BEGIN_FETCH_FCM_TOKEN = 'BEGIN_FETCH_FETCH_FCM_TOKEN';
export const RECEIVE_FCM_TOKEN = 'RECEIVE_FCM_TOKEN';

export function subscribe(item, origin) {
    return { type: SUBSCRIBE, item, origin }
}

export function unsubscribe(item, origin) {
    return { type: UNSUBSCRIBE, item, origin }
}

export function begin_fetch_fcm_token() {
    return { type: BEGIN_FETCH_FCM_TOKEN, requested_at: new Date() }
}

export function receive_fcm_token(token) {
    return { type: RECEIVE_FCM_TOKEN, received_at: new Date(), token }
}

// stuff for FCM

import FCM, {
    FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType
} from "react-native-fcm";

export function fetch_fcm_token() {
    return function (dispatch, getState) {
        // tell the store that we're starting a query
        dispatch(begin_fetch_fcm_token());

        return FCM.getFCMToken()
            .then(token => {
                // console.log("TOKEN (getFCMToken)", token);

                // persist the token to the store, i assume?
                dispatch(receive_fcm_token(token))
            })
            .catch(error => {
                console.warn("error in fetch_fcm_token(): ", error.message);
            });
    }
}
