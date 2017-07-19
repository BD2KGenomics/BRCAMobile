import {
    BEGIN_QUERY, RECEIVE_PAGE, BEGIN_FETCH_NEXT_PAGE,
    BEGIN_FETCH_DETAILS, RECEIVE_DETAILS,
    SUBSCRIBE, UNSUBSCRIBE,
    BEGIN_FETCH_FCM_TOKEN, RECEIVE_FCM_TOKEN
} from './actions'
import omit from 'lodash/omit';
import * as Immutable from "immutable";

const initialState = Immutable.fromJS({
    subscriptions: Immutable.Map(),
    subsLastUpdatedBy: null,
    variants: Immutable.List(),
    details: Immutable.OrderedMap(),
    isFetching: false,
    isFetchingDetails: false,
    isFetchingToken: false,
    query: null,
    pageIndex: 0,
    pageSize: 100,
    totalResults: -1
});

// FIXME: we *really* need to centralize variant data into a single variant_id => data collection
// different pages will have different retention needs, e.g. subscriptions should always retain its variants' data

function subscriberReducer(state=initialState, action) {
    switch (action.type) {
        case BEGIN_QUERY:
            return state.merge({
                query: action.query,
                pageIndex: 0,
                variants: Immutable.List(),
                totalResults: -1,
                isFetching: true
            });

        case BEGIN_FETCH_NEXT_PAGE:
            return state.merge({
                pageIndex: action.pageIndex,
                isFetching: true
            });

        case RECEIVE_PAGE:
            return state.merge({
                variants: state.get('variants').concat(action.items),
                totalResults: action.totalResults,
                synonyms: action.synonyms,
                isFetching: false
            });

        case BEGIN_FETCH_DETAILS:
            return state.merge({
                isFetchingDetails: true
            });

        case RECEIVE_DETAILS:
            return state.merge({
                details: state.get('details').set(action.variantID, action.item).takeLast(10),
                isFetchingDetails: false
            });

        case SUBSCRIBE:
            return state.merge({
                subscriptions: state.get('subscriptions').set(action.item.id, action.item),
                subsLastUpdatedBy: action.origin
            });

        case UNSUBSCRIBE:
            return state.merge({
                subscriptions: state.get('subscriptions').delete(action.item.id),
                subsLastUpdatedBy: action.origin
            });

        case BEGIN_FETCH_FCM_TOKEN:
            return state.merge({
                isFetchingToken: true,
                token: ''
            });

        case RECEIVE_FCM_TOKEN:
            return state.merge({
                isFetchingToken: false,
                token: action.token
            });

        default:
            return state;
    }
}

export default {
    brca: subscriberReducer
};