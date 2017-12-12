import {
    SET_LICENSE_AGREED
} from './actions';

export const initialState = {
    licenseAgreedVersion: null
};

export default function generalReducer(state=initialState, action) {
    switch (action.type) {
        case SET_LICENSE_AGREED:
            return Object.assign({}, state, {
                licenseAgreedVersion: action.version
            });

        default:
            return state;
    }
}
