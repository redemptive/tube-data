<script>
	import { onMount } from 'svelte';
	import RouteAccordion from '$lib/components/RouteAccordion.svelte';
	import { fetchTubeStatuses } from '$lib/tfl.js';

	/** @type {import('$lib/tfl.js').LineStatus[]} */
	let tubeLines = [];
	let loading = true;
	let error = '';

	onMount(() => {
		loadTubeLines();
	});

	async function loadTubeLines() {
		loading = true;
		error = '';

		try {
			tubeLines = await fetchTubeStatuses();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Tube route data could not be loaded.';
		} finally {
			loading = false;
		}
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
	<button class="secondary-action" type="button" on:click={loadTubeLines} disabled={loading}>
		{loading ? 'Refreshing' : 'Refresh'}
	</button>
</section>

{#if loading && tubeLines.length === 0}
	<div class="state-panel" role="status">Loading routes...</div>
{:else if error}
	<div class="state-panel error" role="alert">
		<p>{error}</p>
		<button type="button" on:click={loadTubeLines}>Try again</button>
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
