import type { StorybookConfig } from '@storybook/svelte-vite';

// A Svelte component library, not a SvelteKit app: the framework is @storybook/svelte-vite.
const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|ts|svelte)'],
	addons: ['@storybook/addon-docs', '@storybook/addon-svelte-csf', '@storybook/addon-a11y'],
	// No build or dev server reports usage to Storybook (STORYBOOK_DISABLE_TELEMETRY=1 in the scripts says the same).
	core: { disableTelemetry: true },
	framework: {
		name: '@storybook/svelte-vite',
		options: {},
	},
};

export default config;
