import {
    BEGIN_QUERY, RECEIVE_PAGE, BEGIN_FETCH_NEXT_PAGE,
    SUBSCRIBE, UNSUBSCRIBE
} from './actions'
import omit from 'lodash/omit';

const initialState = {
    subscriptions: {},
    variants: [],
    isFetching: false,
    query: null,
    pageIndex: 0,
    pageSize: 10,
    totalResults: -1
};

function subscriberReducer(state=initialState, action) {
    switch (action.type) {
        case BEGIN_QUERY:
            return Object.assign({}, state, {
                query: action.query,
                pageIndex: 0,
                variants: [],
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
                variants: state.variants.concat(action.items),
                totalResults: action.totalResults,
                synonyms: action.synonyms,
                isFetching: false
            });

        case SUBSCRIBE:
            return Object.assign({}, state, {
                subscriptions: Object.assign({}, state.subscriptions, { [action.item.id]: action.item })
            });

        case UNSUBSCRIBE:
            return Object.assign({}, state, {
                subscriptions: omit(state.subscriptions, action.item.id)
            });

        default:
            return state;
    }
}

export default {
    brca: subscriberReducer
};