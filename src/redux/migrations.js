import { initialState as browsingInitialState } from './browsing/reducer';
import { initialState as generalInitialState } from './general/reducer';

const migrations = {
    0: (state) => {
        return {
            ...state,
            browsing: browsingInitialState // reset any variants we might've searched for before
        }
    },
    2: (state) => {
        return {
            ...state,
            general: generalInitialState // init the general reducer, which currently just includes the license agreement bit
        }
    },
};

export default migrations;
