<script>
	import { onMount } from 'svelte';
	import RouteAccordion from '$lib/components/RouteAccordion.svelte';
	import { fetchTubeStatuses } from '$lib/tfl.js';

	/** @type {import('$lib/tfl.js').LineStatus[]} */
	let tubeLines = [];
	let loading = true;
	let error = '';
	/** @type {Date | null} */
	let lastUpdated = null;
	let showingCachedData = false;

	onMount(() => {
		loadTubeLines();
	});

	/**
	 * @param {{ force?: boolean }} [options]
	 */
	async function loadTubeLines(options = {}) {
		loading = true;
		error = '';

		try {
			const response = await fetchTubeStatuses(options);
			tubeLines = response.data;
			lastUpdated = response.fetchedAt;
			showingCachedData = response.fromCache;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Tube route data could not be loaded.';
		} finally {
			loading = false;
		}
	}

	function refreshTubeLines() {
		loadTubeLines({ force: true });
	}
</script>

<svelte:head>
	<title>Tube Data | Routes</title>
</svelte:head>

<section class="page-heading" aria-labelledby="routes-title">
	<div>
		<p class="eyebrow">Inbound stop sequences</p>
		<h1 id="routes-title">Tube routes</h1>
	</div>
	<button class="secondary-action" type="button" on:click={refreshTubeLines} disabled={loading}>
		{loading ? 'Refreshing' : 'Refresh'}
	</button>
</section>

{#if lastUpdated}
	<p class="timestamp">
		Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
		{#if showingCachedData}
			<span>cached</span>
		{/if}
	</p>
{/if}

{#if loading && tubeLines.length === 0}
	<div class="state-panel" role="status">Loading routes...</div>
{:else if error}
	<div class="state-panel error" role="alert">
		<p>{error}</p>
		<button type="button" on:click={refreshTubeLines}>Try again</button>
	</div>
{:else if tubeLines.length === 0}
	<div class="state-panel">No route data is available right now.</div>
{:else}
	<section class="route-list" aria-label="Tube route list">
		{#each tubeLines as line (line.id)}
			<RouteAccordion {line} />
		{/each}
	</section>
{/if}
