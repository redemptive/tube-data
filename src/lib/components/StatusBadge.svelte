<script>
	export let status = 'Unknown';

	$: severityClass = status.toLowerCase().replaceAll(' ', '-');
</script>

<span class="status-badge {severityClass}">{status}</span>
