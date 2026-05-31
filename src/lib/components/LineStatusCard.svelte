<script>
	import StatusBadge from './StatusBadge.svelte';
	import { getLineColour, getReadableTextColour } from '$lib/line-colours.js';

	/** @type {import('$lib/tfl.js').LineStatus} */
	export let line;

	let detailsOpen = false;

	$: background = getLineColour(line.id);
	$: foreground = getReadableTextColour(line.id);
	$: detailId = `line-detail-${line.id}`;
</script>

<article class="line-card" style:--line-colour={background} style:--line-text={foreground}>
	<header>
		<h2>{line.name}</h2>
		<StatusBadge status={line.status} />
	</header>
	{#if line.reason}
		<p>Disruption details are available.</p>
		<button
			class="detail-toggle"
			type="button"
			aria-expanded={detailsOpen}
			aria-controls={detailId}
			on:click={() => (detailsOpen = !detailsOpen)}
		>
			{detailsOpen ? 'Hide details' : 'Show details'}
		</button>

		{#if detailsOpen}
			<div class="line-detail" id={detailId}>
				<p>{line.reason}</p>
			</div>
		{/if}
	{:else}
		<p>No reported disruptions.</p>
	{/if}
</article>
