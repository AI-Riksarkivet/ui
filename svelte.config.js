import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Read by svelte-check, Storybook and vitest. Consumers compile the sources with their own config.
export default {
	preprocess: vitePreprocess(),
};
