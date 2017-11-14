import {
    SET_DEBUG_MSG_HIDDEN,
    SET_DEBUGGING, SET_ORANGE_HEADER_HIDDEN, SET_QUICK_REFRESH, SET_REFRESH_MOCKED
} from './actions';
import * as Immutable from "immutable";

const initialState = Immutable.fromJS({
    isDebugging: false,
    isDebugMsgHidden: false,
    isOrangeHeaderHidden: false,
    isRefreshMocked: false,
    isQuickRefreshing: false
});

export default function debuggingReducer(state=initialState, action) {
    switch (action.type) {
        case SET_DEBUGGING:
            const nextState = {
                isDebugging: action.isDebugging
            };

            // restore the defaults if we're turning it off
            if (!action.isDebugging) {
                return initialState;
            }

            return state.merge(nextState);

        case SET_DEBUG_MSG_HIDDEN:
            return state.merge({
                isDebugMsgHidden: action.isDebugMsgHidden
            });

        case SET_ORANGE_HEADER_HIDDEN:
            return state.merge({
                isOrangeHeaderHidden: action.isOrangeHeaderHidden
            });

        case SET_REFRESH_MOCKED:
            return state.merge({
                isRefreshMocked: action.isRefreshMocked
            });

        case SET_QUICK_REFRESH:
            return state.merge({
                isQuickRefreshing: action.isQuickRefreshing
            });

        default:
            return state;
    }
}
