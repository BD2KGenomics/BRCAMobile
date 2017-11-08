import {
    SET_DEBUG_MSG_HIDDEN,
    SET_DEBUGGING, SET_REFRESH_MOCKED
} from './actions';
import * as Immutable from "immutable";

const initialState = Immutable.fromJS({
    isDebugging: false,
    isDebugMsgHidden: false,
    isRefreshMocked: false
});

export default function debuggingReducer(state=initialState, action) {
    switch (action.type) {
        case SET_DEBUGGING:
            const nextState = {
                isDebugging: action.isDebugging
            };

            // unconditionally disable various debug settings if we disable debugging
            if (!action.isDebugging) {
                nextState.isRefreshMocked = false;
                nextState.isDebugMsgHidden = false;
            }

            return state.merge(nextState);

        case SET_DEBUG_MSG_HIDDEN:
            return state.merge({
                isDebugMsgHidden: action.isDebugMsgHidden
            });

        case SET_REFRESH_MOCKED:
            return state.merge({
                isRefreshMocked: action.isRefreshMocked
            });

        default:
            return state;
    }
}
