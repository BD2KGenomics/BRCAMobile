export const types = {
  QUERY_VARIANTS: 'QUERY_VARIANTS',
  RECEIVE_VARIANTS: 'RECEIVE_VARIANTS'
};

export function loadVariants(query) {
  return {
    type: types.QUERY_VARIANTS,
    query: query
  };
}

export function receiveVariants(variants) {
  return {
    type: types.RECEIVE_VARIANTS,
    variants: variants
  };
}
