<script>
	import StatusBadge from './StatusBadge.svelte';
	import { getLineColour, getReadableTextColour } from '$lib/line-colours.js';

	/** @type {import('$lib/tfl.js').LineStatus} */
	export let line;

	$: status = line.lineStatuses?.[0]?.statusSeverityDescription ?? 'Unknown';
	$: reason = line.lineStatuses?.[0]?.reason ?? '';
	$: background = getLineColour(line.id);
	$: foreground = getReadableTextColour(line.id);
</script>

<article class="line-card" style:--line-colour={background} style:--line-text={foreground}>
	<header>
		<h2>{line.name}</h2>
		<StatusBadge {status} />
	</header>
	{#if reason}
		<p>{reason}</p>
	{:else}
		<p>No reported disruptions.</p>
	{/if}
</article>
