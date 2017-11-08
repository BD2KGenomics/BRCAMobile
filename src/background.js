import {
    NetInfo
} from 'react-native';
import BackgroundTask from 'react-native-background-task';
import {observe_notification, set_nextcheck_time, set_updated_to_version} from "./redux/notifylog/actions";

// controls how frequently the background task will poll
// next time = POLL_PERIOD + random(0, POLL_PERIOD)
const POLL_PERIOD = 12*60*60*1000; // half a day in msec

/**
 * Creates a URL for fetching summary variant data for the given release_ID
 * @param release_ID the release for which to grab data
 * @returns {string} the URL from which to fetch this releases' data
 */
function makeReleaseURL(release_ID, target_host) {
    const includes = [
        'Variant_in_ENIGMA',
        'Variant_in_ClinVar',
        'Variant_in_1000_Genomes',
        'Variant_in_ExAC',
        'Variant_in_LOVD',
        'Variant_in_BIC',
        'Variant_in_ESP',
        'Variant_in_exLOVD'
    ];

    const change_types = [
        'changed_classification',
        'added_classification'
    ];

    const column = [
        'id',
        'Genomic_Coordinate_hg38',
        'Pathogenicity_expert',
        'HGVS_cDNA'
    ];

    const include_str = includes.map(x => `&include=${x}`).join('');
    const changes_str = change_types.map(x => `&change_types=${x}`).join('');
    const column_str = column.map(x => `&column=${x}`).join('');

    return `http://${target_host}/backend/data/?format=json&page_size=100000${include_str}${changes_str}${column_str}&release=${release_ID}`;
}

/**
 * Checks brcaexchange.org for a database update, subject to the following (overrideable) checks.
 *
 * If (Date.now() < nextCheck) && !ignore_backoff, abort
 * If (version from site <= lastVersion) && !ignore_older_version, abort
 * If (not in subscription list) && !all_subscribed, skip notify
 * @param store the redux store, which contains state and actions to manage notifications
 * @param ignore_backoff (optional) if true, skips the backoff check (usually 12-24hrs after the last one)
 * @param ignore_older_version (optional) if true, skips checking the previously-grabbed version against the current
 * @param all_subscribed (optional) if true, announces this variant even if we're not subscribed
 * @returns {Promise.<string>}
 */
export async function checkForUpdate(store, { ignore_backoff, ignore_older_version, all_subscribed }) {
    // establish defaults for our optional params
    ignore_backoff = ignore_backoff || false;
    ignore_older_version = ignore_older_version || false;
    all_subscribed = all_subscribed || false;

    const store_state = store.getState();

    // enable the mock server only if both debugging and the mock refresh server option are enabled
    const isDebugging = store_state.getIn(['debugging', 'isDebugging']);
    const isRefreshMocked = store_state.getIn(['debugging', 'isRefreshMocked']);
    const targetHost = (isDebugging && isRefreshMocked ? "40.78.27.48:8500" : "brcaexchange.org");

    // check nextcheck timestamp; if nextcheck && now < nextcheck, abort
    const nextCheck = store_state.getIn(['notifylog', 'nextCheck']);
    const currently = Date.now();

    if ((nextCheck && currently < nextCheck)) {
        if (!ignore_backoff) {
            console.log(`exiting check_for_updates() since nextCheck is still ${1|((nextCheck - currently)/(1000*60))}min in the future`);

            const nextCheckDateStr = new Date(nextCheck).toLocaleDateString();
            return `Next scheduled update is at ${nextCheckDateStr}`;
        }
        else {
            console.log("check_for_updates() would have aborted at time check, but ignore_backoff overrode it");
        }
    }

    // FIXME: check for network connectivity before leaping in?

    /*
    const connectionInfo = await NetInfo.getConnectionInfo();
    console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    */

    // Fetch some data over the network which we want the user to have an up-to-
    // date copy of, even if they have no network when using the app
    const targetReleasesURL = `http://${targetHost}/backend/data/releases`;
    console.log("accessing ", targetReleasesURL, "...");
    const response = await fetch(targetReleasesURL, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    const releases_meta = await response.json();
    const releases = releases_meta['releases'], latest = releases_meta['latest'];

    // set nextcheck to now + random(POLL_PERIOD, POLL_PERIOD*2)
    const random_offset_ms = POLL_PERIOD + 1|(Math.random()*POLL_PERIOD);
    store.dispatch(set_nextcheck_time(Date.now() + random_offset_ms));

    // Data persisted to AsyncStorage can later be accessed by the foreground app
    console.log('releases: ', releases, ', latest: ', latest);

    // check lastRelease; if lastRelease && lastRelease >= latest, abort
    const lastCheckedVersion = store.getState().getIn(['notifylog', 'latestVersion']);

    if ((lastCheckedVersion && lastCheckedVersion >= latest)) {
        if (!ignore_older_version) {
            console.log(`exiting check_for_updates() since lastCheckedVersion (${lastCheckedVersion}) >= latest (${latest})`);
            return `Already up to date!`;
        }
        else {
            console.log("check_for_updates() would have aborted at version check, but ignore_older_version overrode it");
        }
    }

    // FIXME: do we get every release from the current (potentially empty) release to now? that might be costly

    // download added/changed variants for the current release
    const target_url = makeReleaseURL(latest, targetHost);
    console.log("target: ", target_url);

    const data = await fetch(target_url, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    const data_decoded = await data.json();
    console.log(data_decoded);

    // nab our list of subscriptions so we can skip announcing things that we aren't subscribed to
    const subscriptions = store.getState().getIn(['subscribing','subscriptions']).keySeq();

    // announce all variants to notifylog reducer, which will filter to our desired ones
    data_decoded.data.forEach(x => {
        // optimization to keep us from notifying if we're not subscribed
        if (all_subscribed || subscriptions.includes(x['Genomic_Coordinate_hg38'])) {
            const simple_cDNA = x.HGVS_cDNA.split(':')[1];

            // FIXME: we should natively be able to deal with variant data, not shoehorn it into the old notif structure
            const notif = {
                version: latest,
                variant_id: x.id,
                genome_id: x['Genomic_Coordinate_hg38'],
                pathogenicity: x.Pathogenicity_expert,
                title: `${simple_cDNA} has changed significance`,
                body: `The clinical significance of ${simple_cDNA} has changed to '${x['Pathogenicity_expert']}'`,
                click_action: '' // ???
            };

            store.dispatch(observe_notification(notif, all_subscribed));
        }
    });

    // set the last-checked version so we don't repeatedly redownload and reannounce updates
    store.dispatch(set_updated_to_version(latest));

    console.log('...done!');
    return "Refreshed!";
}
