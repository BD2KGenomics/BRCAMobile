import {
    SUBSCRIBE, UNSUBSCRIBE
} from './actions';
import * as Immutable from "immutable";

const initialState = {
    subscriptions: Immutable.Map(),
    subsLastUpdatedBy: null
};

// FIXME: we *really* need to centralize variant data into a single variant_id => data collection
// different pages will have different retention needs, e.g. subscribing should always retain its variants' data

export default function subscriptionsReducer(state=initialState, action) {
    switch (action.type) {
        case SUBSCRIBE:
            return Object.assign({}, state, {
                subscriptions: state.subscriptions.set(action.item['Genomic_Coordinate_hg38'], action.item),
                subsLastUpdatedBy: action.origin
            });

        case UNSUBSCRIBE:
            return Object.assign({}, state, {
                subscriptions: state.subscriptions.delete(action.item['Genomic_Coordinate_hg38']),
                subsLastUpdatedBy: action.origin
            });

        default:
            return state;
    }
}
