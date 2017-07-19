/* action types and creators */

export const BEGIN_QUERY = 'BEGIN_QUERY';
export const BEGIN_FETCH_NEXT_PAGE = 'BEGIN_FETCH_NEXT_PAGE';
export const RECEIVE_PAGE = 'RECEIVE_PAGE';
export const BEGIN_FETCH_DETAILS = 'BEGIN_FETCH_DETAILS';
export const RECEIVE_DETAILS = 'RECEIVE_DETAILS';
export const SUBSCRIBE = 'SUBSCRIBE';
export const UNSUBSCRIBE = 'UNSUBSCRIBE';
export const BEGIN_FETCH_FCM_TOKEN = 'BEGIN_FETCH_FETCH_FCM_TOKEN';
export const RECEIVE_FCM_TOKEN = 'RECEIVE_FCM_TOKEN';

export function begin_query(query) {
    return { type: BEGIN_QUERY, requested_at: new Date(), query }
}

export function begin_fetch_next_page(pageIndex) {
    return { type: BEGIN_FETCH_NEXT_PAGE, requested_at: new Date(), pageIndex }
}

export function receive_page(idx, items, totalResults, synonyms) {
    return { type: RECEIVE_PAGE, received_at: new Date(), items, totalResults, synonyms }
}

export function begin_fetch_details(variantID) {
    return { type: BEGIN_FETCH_DETAILS, requested_at: new Date(), variantID }
}

export function receive_details(variantID, item) {
    return { type: RECEIVE_DETAILS, received_at: new Date(), variantID, item }
}

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

export function query_variants(query) {
    return function (dispatch, getState) {
        const { pageSize } = getState().toJS().brca;

        // tell the store that we're starting a query
        dispatch(begin_query(query));

        // now make the actual query...
        return queryVariantsForPage(query, 0, pageSize)
            .then(json => {
                // ...and persist the results to the store
                dispatch(receive_page(0, json.data, json.count, json.synonyms));
            })
            .catch(error => {
                console.warn(error.message);
            });
    }
}

export function fetch_next_page() {
    return function(dispatch, getState) {
        const { query, pageIndex, pageSize } = getState().toJS().brca;

        if (query === null) {
            console.warn("Fetch next page called with null query, aborting");
            return null;
        }

        let curPage = pageIndex + 1;

        dispatch(begin_fetch_next_page(curPage));

        return queryVariantsForPage(query, curPage, pageSize)
            .then(json => {
                dispatch(receive_page(curPage, json.data, json.count, json.synonyms));
            });
    }
}

export function fetch_details(variantID) {
    return function (dispatch, getState) {
        // const { details } = getState().get('brca.details');
        const details = getState().get('brca').get('details');

        // tell the store that we're starting a fetch details operation
        dispatch(begin_fetch_details(variantID));

        // if we already have the variant in our store, return it immediately
        if (details.has(variantID)) {
            return receive_details(variantID, details.get(variantID));
        }

        // now make the actual query...
        return fetchDetails(variantID)
            .then(json => {
                // ...and persist the results to the store
                dispatch(receive_details(variantID, { versions: json.data }));
            })
            .catch(error => {
                console.warn(error.message);
                // FIXME: maybe show a toast as well?
            });
    }
}

// stuff for FCM
import FCM, {
    FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType
} from "react-native-fcm";
import 'whatwg-fetch';
import {checkStatus} from '../toolbox/misc';

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

// helper functions

export function encodeParams(params) {
    const esc = encodeURIComponent;
    return Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
}

export function queryVariantsForPage(query, page_num, page_size) {
    let args = {
        format: 'json',
        search_term: query,
        page_size: page_size,
        page_num: page_num
    };

    // extra params
    const includes = [
        'Variant_in_ENIGMA',
        'Variant_in_ClinVar',
        'Variant_in_1000_Genomes',
        'Variant_in_ExAC',
        'Variant_in_LOVD',
        'Variant_in_BIC',
        'Variant_in_ESP',
        'Variant_in_exLOVD'
    ];
    const include_params = "&" + includes.map(x => "include=" + x).join("&");

    let queryString = 'http://brcaexchange.org/backend/data/?' + encodeParams(args) + include_params;
    console.log("Query Request: ", queryString);

    return fetch(queryString)
        .then(checkStatus)
        .catch((error) => console.warn("fetch error:", error.message))
        .then(response => response.json());
}

export function fetchDetails(variantID) {
    let args = {
        variant_id: variantID
    };

    let queryString = 'http://brcaexchange.org/backend/data/variant/?' + encodeParams(args);
    // console.log("Details Request: ", queryString);

    return fetch(queryString)
        .then(checkStatus)
        .catch((error) => console.warn("fetch error:", error.message))
        .then(response => response.json());
}