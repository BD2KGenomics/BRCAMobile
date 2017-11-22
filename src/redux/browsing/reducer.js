import {
    BEGIN_QUERY, RECEIVE_PAGE, BEGIN_FETCH_NEXT_PAGE,
    BEGIN_FETCH_DETAILS, RECEIVE_DETAILS, PURGE_DETAILS
} from './actions';
import * as Immutable from "immutable";

const initialState = {
    variants: Immutable.List(),
    details: Immutable.OrderedMap(),
    isFetching: false,
    isFetchingDetails: false,
    query: null,
    pageIndex: 0,
    pageSize: 75,
    totalResults: -1
};

// FIXME: we *really* need to centralize variant data into a single variant_id => data collection
// different pages will have different retention needs, e.g. subscribing should always retain its variants' data

export default function browsingReducer(state=initialState, action) {
    switch (action.type) {
        case BEGIN_QUERY:
            return Object.assign({}, state, {
                query: action.query,
                pageIndex: 0,
                variants: Immutable.List(),
                totalResults: -1,
                isFetching: true
            });

        case BEGIN_FETCH_NEXT_PAGE:
            return Object.assign({}, state, {
                pageIndex: action.pageIndex,
                isFetching: true
            });

        case RECEIVE_PAGE:
            return Object.assign({}, state, {
                variants: state.variants.concat(Immutable.fromJS(action.items)),
                totalResults: action.totalResults,
                synonyms: action.synonyms,
                isFetching: false
            });

        case BEGIN_FETCH_DETAILS:
            return Object.assign({}, state, {
                isFetchingDetails: true
            });

        case RECEIVE_DETAILS:
            return Object.assign({}, state, {
                details: state.details.set(action.variantID, action.item).takeLast(10),
                isFetchingDetails: false
            });

        case PURGE_DETAILS:
            return Object.assign({}, state, {
                details: state.details.delete(action.variantID)
            });

        default:
            return state;
    }
}
