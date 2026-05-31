/** @type {Record<string, string>} */
const LINE_COLOURS = {
	bakerloo: '#b36305',
	central: '#e32017',
	circle: '#ffd300',
	district: '#00782a',
	dlr: '#00a4a7',
	'hammersmith-city': '#f3a9bb',
	jubilee: '#a0a5a9',
	metropolitan: '#9b0056',
	northern: '#000000',
	piccadilly: '#003688',
	victoria: '#0098d4',
	'waterloo-city': '#95cdba'
};

/**
 * @param {string} lineId
 */
export function getLineColour(lineId) {
	return LINE_COLOURS[lineId] ?? '#4b5563';
}

/**
 * @param {string} lineId
 */
export function getReadableTextColour(lineId) {
	return ['circle', 'hammersmith-city', 'waterloo-city', 'jubilee'].includes(lineId)
		? '#111827'
		: '#ffffff';
}
