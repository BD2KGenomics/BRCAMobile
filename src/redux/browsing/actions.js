/* action types and creators */

import {
    fetchDetails, fetchVariantIDForGenomicCoord,
    queryVariantsForPage
} from "./helpers";

export const BEGIN_QUERY = 'BEGIN_QUERY';
export const BEGIN_FETCH_NEXT_PAGE = 'BEGIN_FETCH_NEXT_PAGE';
export const RECEIVE_PAGE = 'RECEIVE_PAGE';
export const BEGIN_FETCH_DETAILS = 'BEGIN_FETCH_DETAILS';
export const RECEIVE_DETAILS = 'RECEIVE_DETAILS';
export const PURGE_DETAILS = 'PURGE_DETAILS';

export function begin_query(query) {
    return { type: BEGIN_QUERY, requested_at: new Date(), query }
}

export function begin_fetch_next_page(pageIndex) {
    return { type: BEGIN_FETCH_NEXT_PAGE, requested_at: new Date(), pageIndex }
}

export function receive_page(idx, items, totalResults, synonyms) {
    return { type: RECEIVE_PAGE, received_at: new Date(), items, totalResults, synonyms }
}

export function begin_fetch_details(variantID) {
    return { type: BEGIN_FETCH_DETAILS, requested_at: new Date(), variantID }
}

export function receive_details(variantID, item) {
    return { type: RECEIVE_DETAILS, received_at: new Date(), variantID, item }
}

export function purge_details(variantID) {
    return { type: PURGE_DETAILS, received_at: new Date(), variantID }
}

export function query_variants(query) {
    return function (dispatch, getState) {
        const pageSize = getState().getIn(['browsing','pageSize']);

        // tell the store that we're starting a query
        dispatch(begin_query(query));

        // now make the actual query...
        return queryVariantsForPage(query, 0, pageSize)
            .then(json => {
                // ...and persist the results to the store
                dispatch(receive_page(0, json.data, json.count, json.synonyms));
            })
            .catch(error => {
                console.warn(error.message);
            });
    }
}

export function fetch_next_page() {
    return function(dispatch, getState) {
        const { query, pageIndex, pageSize } = getState().get('browsing').toJS();

        if (query === null) {
            console.warn("Fetch next page called with null query, aborting");
            return null;
        }

        let curPage = pageIndex + 1;

        dispatch(begin_fetch_next_page(curPage));

        return queryVariantsForPage(query, curPage, pageSize)
            .then(json => {
                dispatch(receive_page(curPage, json.data, json.count, json.synonyms));
            });
    }
}

export function fetch_details(variantID, isGenomeCoord=false) {
    return async function (dispatch, getState) {
        // const { details } = getState().get('brca.details');
        const details = getState().get('browsing').get('details');

        // if it's a genomic coordinate, we have to first map to the most recent variant ID
        // (it'd be nice if the API could be queried for a genomic coordinate rather than just the variant ID)
        if (isGenomeCoord) {
            // tell the store that we're starting a fetch details operation
            dispatch(begin_fetch_details(variantID));

            const genomeID = variantID.slice();

            return fetchVariantIDForGenomicCoord(genomeID).then(variantID => {
                console.log("got variant ID ", variantID, " from ", genomeID);
                return fetchDetails(variantID);
            }).then(json => {
                console.log("fetchDetails gave us ", json);
                dispatch(receive_details(json.data[0].id, { versions: json.data }));
            });
        }
        else {
            // tell the store that we're starting a fetch details operation
            dispatch(begin_fetch_details(variantID));

            // if we already have the variant in our store, return it immediately
            if (details.has(variantID)) {
                return receive_details(variantID, details.get(variantID));
            }

            // now make the actual query...
            return fetchDetails(variantID)
                .then(json => {
                    console.log("Got details for ", variantID);

                    // ...and persist the results to the store
                    dispatch(receive_details(variantID, { versions: json.data }));
                })
                .catch(error => {
                    console.warn(error.message);
                    // FIXME: maybe show a toast as well?
                });

        }
    }
}
