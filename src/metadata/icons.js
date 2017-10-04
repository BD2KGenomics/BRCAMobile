
// 'lens' is slightly larger
export const patho_indicators = {
    'pathogenic': {
        title: 'Pathogenic',
        color: '#e7b34e', name: 'fiber-manual-record'
    },
    'likely pathogenic': {
        title: 'Likely Pathogenic',
        color: '#e7b34e', name: 'radio-button-checked'
    },
    'unknown significance': {
        title: 'Uncertain Significance',
        color: '#aaa', name: 'radio-button-checked'
    },
    'likely benign': {
        title: 'Likely Benign',
        color: '#7ab1e8', name: 'radio-button-checked'
    },
    'benign / little clinical significance': {
        title: 'Benign / Little Clinical Significance',
        color: '#7ab1e8', name: 'fiber-manual-record'
    },
    'not yet reviewed': {
        title: 'Not Yet Reviewed',
        color: '#ddd', name: 'fiber-manual-record'
    },
};

/**
 * Normalizes the server's response (which can have varying case, include previously-unseen statuses, etc.
 * and returns the corresponding icon metadata.
 * @param patho the pathogenicity string from the server
 * @returns {*} the corresponding entry from patho_indicators
 */
export function getIconByPathogenicity(patho) {
    if (!patho) {
        return patho_indicators['not yet reviewed'];
    }

    let lc_patho = patho.toLowerCase();

    if (lc_patho === 'uncertain') {
        lc_patho = 'unknown significance';
    }

    return patho_indicators.hasOwnProperty(lc_patho)
        ? patho_indicators[lc_patho]
        : patho_indicators["not yet reviewed"];
}

export const follow_indicators = {
    'Following Variant': {
        name: "bookmark", color: "#555"
    },
    'Not Following Variant': {
        name: "bookmark-border", color: "#eee"
    }
};
