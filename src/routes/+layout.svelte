<script>
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import '../app.css';

	const themeKey = 'tube-data-theme';

	let theme = 'light';

	onMount(() => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
	});

	/**
	 * @param {'light' | 'dark'} nextTheme
	 */
	function setTheme(nextTheme) {
		theme = nextTheme;
		document.documentElement.dataset.theme = theme;
		localStorage.setItem(themeKey, theme);
	}

	function toggleTheme() {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	}
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
		<div class="header-actions">
			<nav aria-label="Primary navigation">
				<a href={resolve('/')} data-sveltekit-reload={false}>Status</a>
				<a href={resolve('/routes/')} data-sveltekit-reload={false}>Routes</a>
			</nav>
			<button
				class="theme-toggle"
				type="button"
				aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
				aria-pressed={theme === 'dark'}
				on:click={toggleTheme}
			>
				<span class="theme-mark" aria-hidden="true"></span>
				<span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
			</button>
		</div>
	</header>

	<main>
		<slot />
	</main>
</div>
