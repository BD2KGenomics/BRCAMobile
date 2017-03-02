/*
 * action types and creators
 */

export const BEGIN_QUERY = 'BEGIN_QUERY';
export const BEGIN_FETCH_NEXT_PAGE = 'BEGIN_FETCH_NEXT_PAGE';
export const RECEIVE_PAGE = 'RECEIVE_PAGE';
export const SUBSCRIBE = 'SUBSCRIBE';
export const UNSUBSCRIBE = 'UNSUBSCRIBE';

export function begin_query(query) {
    return { type: BEGIN_QUERY, requested_at: new Date(), query }
}

export function begin_fetch_next_page(pageIndex) {
    return { type: BEGIN_FETCH_NEXT_PAGE, requested_at: new Date(), pageIndex }
}

export function receive_page(idx, items, totalResults, synonyms) {
    return { type: RECEIVE_PAGE, received_at: new Date(), items, totalResults, synonyms }
}

export function subscribe(item, origin) {
    return { type: SUBSCRIBE, item, origin }
}

export function unsubscribe(item, origin) {
    return { type: UNSUBSCRIBE, item, origin }
}

export function query_variants(query) {
    return function (dispatch, getState) {
        const { pageSize } = getState().brca;

        // tell the store that we're starting a query
        dispatch(begin_query(query));

        // now make the actual query...
        return queryVariantsForPage(query, 0, pageSize)
            .then(json => {
                // ...and persist the results to the store
                dispatch(receive_page(0, json.data, json.count, json.synonyms));
            })
            .catch(error => {
                console.warn(error);
                // FIXME: maybe show a toast as well?
            });
    }
}

export function fetch_next_page() {
    return function(dispatch, getState) {
        const { query, pageIndex, pageSize } = getState().brca;

        if (query == null) {
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

// helper functions

function encodeParams(params) {
    const esc = encodeURIComponent;
    return Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
}

function queryVariantsForPage(query, page_num, page_size) {
    let args = {
        format: 'json',
        search_term: query,
        page_size: page_size,
        page_num: page_num
    };

    let queryString = 'http://brcaexchange.org/backend/data/?' + encodeParams(args);
    console.log("Request: ", queryString);

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(queryString)
        .then(response => response.json());
}