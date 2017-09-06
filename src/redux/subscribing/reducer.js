import {
    SUBSCRIBE, UNSUBSCRIBE,
    BEGIN_FETCH_FCM_TOKEN, RECEIVE_FCM_TOKEN
} from './actions';
import * as Immutable from "immutable";

const initialState = Immutable.fromJS({
    subscriptions: Immutable.Map(),
    subsLastUpdatedBy: null,
    isFetchingToken: false,
    token: null
});

// FIXME: we *really* need to centralize variant data into a single variant_id => data collection
// different pages will have different retention needs, e.g. subscribing should always retain its variants' data

export default function subscriptionsReducer(state=initialState, action) {
    switch (action.type) {
        case SUBSCRIBE:
            return state.merge({
                subscriptions: state.get('subscriptions').set(action.item['Genomic_Coordinate_hg38'], action.item),
                subsLastUpdatedBy: action.origin
            });

        case UNSUBSCRIBE:
            return state.merge({
                subscriptions: state.get('subscriptions').delete(action.item['Genomic_Coordinate_hg38']),
                subsLastUpdatedBy: action.origin
            });

        case BEGIN_FETCH_FCM_TOKEN:
            return state.merge({
                isFetchingToken: true,
                token: null
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
