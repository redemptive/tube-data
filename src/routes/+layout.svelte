<script>
	import { resolve } from '$app/paths';
	import '../app.css';
</script>

<svelte:head>
	<title>Tube Data</title>
</svelte:head>

<div class="app-shell">
	<header class="site-header">
		<a class="brand" href={resolve('/')} aria-label="Tube Data home">
			<span class="roundel" aria-hidden="true"></span>
			<span>Tube Data</span>
		</a>
		<nav aria-label="Primary navigation">
			<a href={resolve('/')} data-sveltekit-reload={false}>Status</a>
			<a href={resolve('/routes/')} data-sveltekit-reload={false}>Routes</a>
		</nav>
	</header>

	<main>
		<slot />
	</main>
</div>
