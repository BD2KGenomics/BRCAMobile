import {
    BEGIN_QUERY, RECEIVE_PAGE, BEGIN_FETCH_NEXT_PAGE,
    BEGIN_FETCH_DETAILS, RECEIVE_DETAILS
} from './actions';
import * as Immutable from "immutable";

const initialState = Immutable.fromJS({
    variants: Immutable.List(),
    details: Immutable.OrderedMap(),
    isFetching: false,
    isFetchingDetails: false,
    query: null,
    pageIndex: 0,
    pageSize: 100,
    totalResults: -1
});

// FIXME: we *really* need to centralize variant data into a single variant_id => data collection
// different pages will have different retention needs, e.g. subscribing should always retain its variants' data

export default function browsingReducer(state=initialState, action) {
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

        default:
            return state;
    }
}
