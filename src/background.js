import {
    NetInfo
} from 'react-native';
import BackgroundTask from 'react-native-background-task';
import {observe_notification, set_nextcheck_time, set_updated_to_version} from "./redux/notifylog/actions";

// FIXME: remove before deployment
const MOCK_SERVER = true;
const TARGET_HOST = MOCK_SERVER ? "localhost:8543" : "brcaexchange.org";

/**
 * Creates a URL for fetching summary variant data for the given release_ID
 * @param release_ID the release for which to grab data
 * @returns {string} the URL from which to fetch this releases' data
 */
function makeReleaseURL(release_ID) {
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

    return `http://${TARGET_HOST}/backend/data/?format=json&page_size=100000${include_str}${changes_str}${column_str}&release=${release_ID}`;
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
 * @returns {Promise.<void>}
 */
export async function checkForUpdate(store, ignore_backoff, ignore_older_version, all_subscribed) {
    // establish defaults for our optional params
    ignore_backoff = ignore_backoff || false;
    ignore_older_version = ignore_older_version || false;
    all_subscribed = all_subscribed || false;

    // check nextcheck timestamp; if nextcheck && now < nextcheck, abort
    const nextCheck = store.getState().getIn(['notifylog', 'nextCheck']);
    const currently = Date.now();

    if ((nextCheck && currently < nextCheck)) {
        if (!ignore_backoff) {
            console.log(`exiting check_for_updates() since nextCheck is still ${1|((nextCheck - currently)/(1000*60))}min in the future`);
            return;
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
    const response = await fetch(`http://${TARGET_HOST}/backend/data/releases`);
    const releases_meta = await response.json();
    const releases = releases_meta['releases'], latest = releases_meta['latest'];

    // set nextcheck to now + random(12hr,24hr)
    const halfday_ms = 12*60*60*1000;
    const random_offset_ms = halfday_ms + 1|(Math.random()*halfday_ms);
    store.dispatch(set_nextcheck_time(Date.now() + random_offset_ms));

    // Data persisted to AsyncStorage can later be accessed by the foreground app
    console.log('releases: ', releases, ', latest: ', latest);

    // check lastRelease; if lastRelease && lastRelease >= latest, abort
    const lastCheckedVersion = store.getState().getIn(['notifylog', 'latestVersion']);

    if ((lastCheckedVersion && lastCheckedVersion >= latest)) {
        if (!ignore_older_version) {
            console.log(`exiting check_for_updates() since lastCheckedVersion (${lastCheckedVersion}) >= latest (${latest})`);
            return;
        }
        else {
            console.log("check_for_updates() would have aborted at version check, but ignore_older_version overrode it");
        }
    }

    // download added/changed variants for the current release
    const target_url = makeReleaseURL(latest);
    console.log("target: ", target_url);

    const data = await fetch(target_url);
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
}
