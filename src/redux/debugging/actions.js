/* action types and creators */

export const SET_DEBUGGING = 'SET_DEBUGGING';
export const SET_DEBUG_MSG_HIDDEN = 'SET_DEBUG_MSG_HIDDEN';
export const SET_ORANGE_HEADER_HIDDEN = 'SET_ORANGE_HEADER_HIDDEN';
export const SET_REFRESH_MOCKED = 'SET_REFRESH_MOCKED';

export function set_debugging(isDebugging) {
    return { type: SET_DEBUGGING, isDebugging }
}

export function set_debug_msg_hidden(isDebugMsgHidden) {
    return { type: SET_DEBUG_MSG_HIDDEN, isDebugMsgHidden }
}

export function set_orange_header_hidden(isOrangeHeaderHidden) {
    return { type: SET_ORANGE_HEADER_HIDDEN, isOrangeHeaderHidden }
}

export function set_refresh_mocked(isRefreshMocked) {
    return { type: SET_REFRESH_MOCKED, isRefreshMocked }
}
