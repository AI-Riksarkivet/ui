import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// The repository's own Vite config: Storybook renders the components with it and vitest runs the tests with it.
// Consumers never read it; they compile the sources with their own.
export default defineConfig({
	plugins: [tailwindcss(), svelte()],
	// A component test mounts in a DOM (happy-dom), so Svelte resolves to its browser build there.
	resolve: process.env['VITEST'] ? { conditions: ['browser'] } : undefined,
	test: {
		// Both homes: the suites in `tests/`, and the few that sit beside their source in `src/`.
		include: ['tests/**/*.{test,spec}.{js,ts}', 'src/**/*.{test,spec}.{js,ts}'],
		exclude: ['node_modules/**', 'storybook-static/**'],
	},
});
