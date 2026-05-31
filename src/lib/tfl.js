const TFL_API_ROOT = 'https://api.tfl.gov.uk';
const CACHE_TTL_MS = 120_000;

/**
 * @typedef {object} RawLineStatusDetail
 * @property {string} [statusSeverityDescription]
 * @property {string} [reason]
 */

/**
 * @typedef {object} RawLineStatus
 * @property {string} id
 * @property {string} name
 * @property {RawLineStatusDetail[]} [lineStatuses]
 * @property {string} [modeName]
 */

/**
 * @typedef {object} LineStatus
 * @property {string} id
 * @property {string} name
 * @property {string} mode
 * @property {string} status
 * @property {string} reason
 * @property {Date} updatedAt
 */

/**
 * @template T
 * @typedef {object} CachedResult
 * @property {T} data
 * @property {Date} fetchedAt
 * @property {boolean} fromCache
 */

/**
 * @typedef {object} StopPoint
 * @property {string} [name]
 */

/**
 * @typedef {object} RouteSequence
 * @property {{ stopPoint?: StopPoint[] }[]} [stopPointSequences]
 */

/** @type {Map<string, { data: unknown, fetchedAt: Date }>} */
const responseCache = new Map();

/**
 * @param {string} path
 * @param {{ force?: boolean }} [options]
 * @returns {Promise<CachedResult<unknown>>}
 */
async function fetchJson(path, options = {}) {
	const cached = responseCache.get(path);
	const cacheIsFresh = cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS;

	if (!options.force && cacheIsFresh) {
		return {
			data: cached.data,
			fetchedAt: cached.fetchedAt,
			fromCache: true
		};
	}

	const response = await fetch(`${TFL_API_ROOT}${path}`);

	if (!response.ok) {
		throw new Error(`TfL returned ${response.status} for ${path}`);
	}

	const data = await response.json();
	const fetchedAt = new Date();

	responseCache.set(path, { data, fetchedAt });

	return {
		data,
		fetchedAt,
		fromCache: false
	};
}

/**
 * @param {RawLineStatus} line
 * @param {Date} fetchedAt
 * @returns {LineStatus}
 */
function normalizeLineStatus(line, fetchedAt) {
	const firstStatus = line.lineStatuses?.[0];

	return {
		id: line.id,
		name: line.name,
		mode: line.modeName ?? 'tube',
		status: firstStatus?.statusSeverityDescription ?? 'Unknown',
		reason: firstStatus?.reason ?? '',
		updatedAt: fetchedAt
	};
}

/**
 * @param {{ force?: boolean }} [options]
 * @returns {Promise<CachedResult<LineStatus[]>>}
 */
export async function fetchTubeStatuses(options = {}) {
	const response = await fetchJson('/Line/Mode/tube/Status?detail=true', options);
	const rawLines = /** @type {RawLineStatus[]} */ (response.data);

	return {
		...response,
		data: rawLines.map((line) => normalizeLineStatus(line, response.fetchedAt))
	};
}

/**
 * @param {{ force?: boolean }} [options]
 * @returns {Promise<CachedResult<LineStatus[]>>}
 */
export async function fetchDlrStatuses(options = {}) {
	const response = await fetchJson('/Line/Mode/dlr/Status?detail=true', options);
	const rawLines = /** @type {RawLineStatus[]} */ (response.data);

	return {
		...response,
		data: rawLines.map((line) => normalizeLineStatus(line, response.fetchedAt))
	};
}

/**
 * @param {{ force?: boolean }} [options]
 * @returns {Promise<CachedResult<LineStatus[]>>}
 */
export async function fetchLineStatuses(options = {}) {
	const [tubeLines, dlrLines] = await Promise.all([
		fetchTubeStatuses(options),
		fetchDlrStatuses(options)
	]);
	const fetchedAt = new Date(Math.max(tubeLines.fetchedAt.getTime(), dlrLines.fetchedAt.getTime()));

	return {
		data: [...tubeLines.data, ...dlrLines.data],
		fetchedAt,
		fromCache: tubeLines.fromCache && dlrLines.fromCache
	};
}

/**
 * @param {string} lineId
 * @param {{ force?: boolean }} [options]
 * @returns {Promise<CachedResult<string[]>>}
 */
export async function fetchRouteStops(lineId, options = {}) {
	const response = await fetchJson(
		`/Line/${encodeURIComponent(lineId)}/Route/Sequence/inbound?serviceTypes=Regular&excludeCrowding=true`,
		options
	);
	const data = /** @type {RouteSequence} */ (response.data);
	const sequence = data.stopPointSequences?.[0]?.stopPoint ?? [];

	return {
		...response,
		data: sequence.flatMap((stop) => (stop.name ? [stop.name] : []))
	};
}
