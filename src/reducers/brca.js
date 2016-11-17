import types from './actions/brcaActions';

const initialState = {
  variants: []
};

export default function brcaApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  if (action === types.QUERY_VARIANTS) {
    // suppose we should load something?
  }

  // For now, don't handle any actions and just return the state given to us.
  return state
}
