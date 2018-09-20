import {
    NetInfo
} from 'react-native';
import {
    observe_batched_notifications, observe_notification, set_nextcheck_time,
    set_updated_to_version
} from "./redux/notifylog/actions";
import {announceBatchedNotifies} from "./redux/notifylog/helpers";

// controls how frequently the background task will poll
// next time = POLL_PERIOD + random(0, POLL_PERIOD)
const QUICK_POLL_PERIOD = 5*60*1000; // 5 minutes
const POLL_PERIOD = 12*60*60*1000; // half a day in msec

export const MOCK_HOST = "dainsleif.pw:8500"; // used to be "40.78.27.48:8500"

/**
 * Creates a URL for fetching summary variant data for the given release_ID
 * @param release_ID the release for which to grab data
 * @param target_host which host to query for the release data
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
    const isDebugging = store_state.debugging.isDebugging;
    const isRefreshMocked = store_state.debugging.isRefreshMocked;
    const isQuickRefreshing = store_state.debugging.isQuickRefreshing;
    const showsVersionInNotify = store_state.debugging.showsVersionInNotify;
    const targetHost = (isDebugging && isRefreshMocked ? MOCK_HOST : "brcaexchange.org");

    console.log("\n--- debug settings below: ---");
    console.log("isDebugging: ", isDebugging);
    console.log("isRefreshMocked: ", isRefreshMocked);
    console.log("isQuickRefreshing: ", isQuickRefreshing);
    console.log("targetHost: ", targetHost);
    console.log("Params: ", JSON.stringify({ ignore_backoff, ignore_older_version, all_subscribed }));
    console.log("--- end debug settings ---\n");


    // note that each numbered stage is reached only if the previous stages complete

    // ================================================================================================
    // === 1. check if we're scheduled to run now
    // ================================================================================================

    // check nextcheck timestamp; if nextcheck && now < nextcheck, abort
    const nextCheck = store_state.notifylog.nextCheck;
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

    // check for network connectivity before leaping in? (TODO: review if this is necessary)
    // const connectionInfo = await NetInfo.getConnectionInfo();
    // console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);


    // ================================================================================================
    // === 2. query /backend/data/release to see if there's a new version
    // ================================================================================================

    // fetch the release metadata to see if there's a new release...
    const targetReleasesURL = `http://${targetHost}/backend/data/releases`;
    console.log("accessing ", targetReleasesURL, "...");
    const response = await fetch(targetReleasesURL, {headers: {'Cache-Control': 'no-cache'}});

    // ...and parse the result
    const releases_meta = await response.json();
    const releases = releases_meta['releases'], latest = releases_meta['latest'];

    // we should set the next time to query the backend regardless of whether there's a new version
    // (the long delay + random backoff should prevent dogpiling the server)
    const pollPeriod = (isQuickRefreshing) ? QUICK_POLL_PERIOD : POLL_PERIOD;
    const random_offset_ms = pollPeriod + 1|(Math.random()*pollPeriod);
    const nextRunTime = Date.now() + random_offset_ms;
    store.dispatch(set_nextcheck_time(nextRunTime));

    console.log('latest release: ', latest);

    // finally, let's see if there's a new version
    // check lastRelease; if lastRelease && lastRelease >= latest, abort
    const lastCheckedVersion = store.getState().notifylog.latestVersion;

    if ((lastCheckedVersion && lastCheckedVersion >= latest)) {
        if (!ignore_older_version) {
            console.log(`exiting check_for_updates() since lastCheckedVersion (${lastCheckedVersion}) >= latest (${latest})`);
            return `Already up to date!`;
        }
        else {
            console.log("check_for_updates() would have aborted at version check, but ignore_older_version overrode it");
        }
    }


    // ================================================================================================
    // === 3. query variant-level detail for the latest release
    // ================================================================================================

    // FIXME: do we get every release from the current (potentially empty) release to now? that might be costly

    // download added/changed variants for the current release...
    const target_url = makeReleaseURL(latest, targetHost);
    console.log("target: ", target_url);
    const data = await fetch(target_url, {headers: {'Cache-Control': 'no-cache'}});
    // ...and parse the result
    const data_decoded = await data.json();

    // nab our list of subscriptions so we can skip announcing things that we aren't subscribed to
    const subscriptions = store_state.subscribing.subscriptions.keySeq();

    // announce all variants to notifylog reducer, which will filter to our desired ones
    // the filter is an optimization to keep us from notifying if we're not subscribed
    store.dispatch(observe_batched_notifications(
        // maps the incoming data into a notification payload that announce expects
        data_decoded.data
            .filter(x => all_subscribed || subscriptions.includes(x['Genomic_Coordinate_hg38']))
            .map(x => {
                const simple_cDNA = x.HGVS_cDNA.split(':')[1];

                // FIXME: we should natively be able to deal with variant data, not shoehorn it into the old notif structure
                return {
                    version: latest,
                    variant_id: x.id,
                    genome_id: x['Genomic_Coordinate_hg38'],
                    pathogenicity: x['Pathogenicity_expert'],
                    title: `${showsVersionInNotify ? `(v${latest}) ` : ''}${simple_cDNA} has changed significance`,
                    body: `The clinical significance of ${simple_cDNA} has changed to '${x['Pathogenicity_expert']}'`,
                    click_action: '' // ???
                };
            })
    , all_subscribed));

    // set the last-checked version so we don't repeatedly redownload and reannounce updates
    store.dispatch(set_updated_to_version(latest));

    console.log('...done! next scheduled run: ', `${nextRunTime ? (new Date(nextRunTime)).toLocaleString() : 'never'}`);
    return "Refreshed!";
}

/**
 * Provides a mechanism for running code once a persistor has hydrated.
 */
export class PersistMonitor {
    /**
     * Attaches to a persistor and executes onLoadedCallback if/when it becomes hydrated.
     * @param persistor the persistor to monitor for hydration
     * @param onLoadedCallback the callback to run if hydration has occurred or when it does occur
     */
    constructor(persistor, onLoadedCallback) {
        this.persistor = persistor;
        this.onLoadedCallback = onLoadedCallback;

        this.attach = this.attach.bind(this);
        this.handlePersistorState = this.handlePersistorState.bind(this);
        this.detach = this.detach.bind(this);

        // run attach (TODO: maybe just have the caller call it?)
        this.attach();
    }

    attach() {
        // subscribe to the persistor's restore event
        this._unsubscribe = this.persistor.subscribe(this.handlePersistorState);
        // and invoke it once to check if we're already rehydrated
        this.handlePersistorState()
    }

    handlePersistorState() {
        const { bootstrapped } = this.persistor.getState();

        console.log("bootstrapped?: ", bootstrapped);

        if (bootstrapped) {
            if (this.onLoadedCallback) {
                this.onLoadedCallback();
            }

            this._unsubscribe && this._unsubscribe();
        }
    };

    detach() {
        this._unsubscribe && this._unsubscribe();
    }
}