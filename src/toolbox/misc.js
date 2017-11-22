/**
 * Created by Faisal on 11/17/16.
 */

import { Iterable } from 'immutable';

// utility method to combine [[1,2,3],[4,5,6]] into [[1,4],[2,5],[3,6]]
export function zip(rows) {
    return rows[0].map((_,c)=>rows.map(row=>row[c]));
}

export function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

export function ensureNonImmutable(target) {
    return Iterable.isIterable(target) ? target.toJS() : target;
}

export function makeCancelable(promise) {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
            error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
}
