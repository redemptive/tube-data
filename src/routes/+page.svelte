<script>
	import { onMount } from 'svelte';
	import LineStatusCard from '$lib/components/LineStatusCard.svelte';
	import { fetchLineStatuses } from '$lib/tfl.js';

	/** @type {import('$lib/tfl.js').LineStatus[]} */
	let lines = [];
	let loading = true;
	let error = '';
	/** @type {Date | null} */
	let lastUpdated = null;
	let showingCachedData = false;

	onMount(() => {
		loadStatuses();
	});

	/**
	 * @param {{ force?: boolean }} [options]
	 */
	async function loadStatuses(options = {}) {
		loading = true;
		error = '';

		try {
			const response = await fetchLineStatuses(options);
			lines = response.data;
			lastUpdated = response.fetchedAt;
			showingCachedData = response.fromCache;
		} catch (err) {
			error = err instanceof Error ? err.message : 'TfL status data could not be loaded.';
		} finally {
			loading = false;
		}
	}

	function refreshStatuses() {
		loadStatuses({ force: true });
	}
</script>

<svelte:head>
	<title>Tube Data | Status</title>
</svelte:head>

<section class="page-heading" aria-labelledby="status-title">
	<div>
		<p class="eyebrow">Live service status</p>
		<h1 id="status-title">Tube and DLR lines</h1>
	</div>
	<button class="secondary-action" type="button" on:click={refreshStatuses} disabled={loading}>
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

{#if loading && lines.length === 0}
	<div class="state-panel" role="status">Loading line status...</div>
{:else if error}
	<div class="state-panel error" role="alert">
		<p>{error}</p>
		<button type="button" on:click={refreshStatuses}>Try again</button>
	</div>
{:else if lines.length === 0}
	<div class="state-panel">No line status data is available right now.</div>
{:else}
	<section class="line-grid" aria-label="Line status list">
		{#each lines as line (line.id)}
			<LineStatusCard {line} />
		{/each}
	</section>
{/if}
