const TFL_API_ROOT = 'https://api.tfl.gov.uk';

/**
 * @typedef {object} LineStatusDetail
 * @property {string} [statusSeverityDescription]
 * @property {string} [reason]
 */

/**
 * @typedef {object} LineStatus
 * @property {string} id
 * @property {string} name
 * @property {LineStatusDetail[]} [lineStatuses]
 */

/**
 * @typedef {object} StopPoint
 * @property {string} [name]
 */

/**
 * @typedef {object} RouteSequence
 * @property {{ stopPoint?: StopPoint[] }[]} [stopPointSequences]
 */

/**
 * @param {string} path
 * @returns {Promise<unknown>}
 */
async function fetchJson(path) {
	const response = await fetch(`${TFL_API_ROOT}${path}`);

	if (!response.ok) {
		throw new Error(`TfL returned ${response.status} for ${path}`);
	}

	return response.json();
}

/**
 * @returns {Promise<LineStatus[]>}
 */
export async function fetchTubeStatuses() {
	return /** @type {Promise<LineStatus[]>} */ (fetchJson('/Line/Mode/tube/Status?detail=true'));
}

/**
 * @returns {Promise<LineStatus[]>}
 */
export async function fetchDlrStatuses() {
	return /** @type {Promise<LineStatus[]>} */ (fetchJson('/Line/Mode/dlr/Status?detail=true'));
}

/**
 * @returns {Promise<LineStatus[]>}
 */
export async function fetchLineStatuses() {
	const [tubeLines, dlrLines] = await Promise.all([fetchTubeStatuses(), fetchDlrStatuses()]);
	return [...tubeLines, ...dlrLines];
}

/**
 * @param {string} lineId
 * @returns {Promise<string[]>}
 */
export async function fetchRouteStops(lineId) {
	const data = /** @type {RouteSequence} */ (
		await fetchJson(
			`/Line/${encodeURIComponent(lineId)}/Route/Sequence/inbound?serviceTypes=Regular&excludeCrowding=true`
		)
	);
	const sequence = data.stopPointSequences?.[0]?.stopPoint ?? [];
	return sequence.flatMap((stop) => (stop.name ? [stop.name] : []));
}
