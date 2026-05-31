<script>
	import StatusBadge from './StatusBadge.svelte';
	import { getLineColour, getReadableTextColour } from '$lib/line-colours.js';
	import { fetchRouteStops } from '$lib/tfl.js';

	/** @type {import('$lib/tfl.js').LineStatus} */
	export let line;

	let expanded = false;
	/** @type {string[]} */
	let stops = [];
	let loading = false;
	let error = '';

	$: background = getLineColour(line.id);
	$: foreground = getReadableTextColour(line.id);
	$: panelId = `route-${line.id}`;

	async function toggle() {
		expanded = !expanded;

		if (!expanded || stops.length > 0 || loading) {
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetchRouteStops(line.id);
			stops = response.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Route stops could not be loaded.';
		} finally {
			loading = false;
		}
	}
</script>

<article class="route-card" style:--line-colour={background} style:--line-text={foreground}>
	<div class="route-summary">
		<div>
			<h2>{line.name}</h2>
			<StatusBadge status={line.status} />
		</div>
		<button type="button" aria-expanded={expanded} aria-controls={panelId} on:click={toggle}>
			{expanded ? 'Hide stops' : 'Show stops'}
		</button>
	</div>

	{#if expanded}
		<div class="route-panel" id={panelId}>
			{#if loading}
				<p class="muted" role="status">Loading stops...</p>
			{:else if error}
				<p class="error-text" role="alert">{error}</p>
			{:else if stops.length === 0}
				<p class="muted">No stops are available for this route.</p>
			{:else}
				<ol>
					{#each stops as stop (stop)}
						<li>{stop}</li>
					{/each}
				</ol>
			{/if}
		</div>
	{/if}
</article>
