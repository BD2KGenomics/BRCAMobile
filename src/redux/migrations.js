import { initialState } from './browsing/reducer';

const migrations = {
    0: (state) => {
        return {
            ...state,
            browsing: initialState // reset any variants we might've searched for before
        }
    }
};

export default migrations;
