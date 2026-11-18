import type { Preview } from '@storybook/svelte';
import { THEMES } from '../src/lib/appearance/core.js';
import './preview.css';

/** Puts the toolbar's theme and mode on <html>, as the boot script and the appearance store do in an app, so every
 *  story is reviewed in every shipped theme, light and dark. */
function applyAppearance(theme: string, mode: string): void {
	const root = document.documentElement;
	root.dataset['theme'] = theme;
	root.classList.toggle('dark', mode === 'dark');
	root.style.colorScheme = mode;
}

const preview: Preview = {
	tags: ['autodocs'],
	globalTypes: {
		theme: {
			description: 'The shipped theme',
			toolbar: {
				title: 'Theme',
				icon: 'paintbrush',
				items: THEMES.map((t) => ({ value: t.id, title: t.label })),
				dynamicTitle: true,
			},
		},
		mode: {
			description: 'Light or dark',
			toolbar: {
				title: 'Mode',
				icon: 'mirror',
				items: [
					{ value: 'light', title: 'Light', icon: 'sun' },
					{ value: 'dark', title: 'Dark', icon: 'moon' },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: { theme: 'ink', mode: 'light' },
	decorators: [
		(story, context) => {
			applyAppearance(
				String(context.globals['theme'] ?? 'ink'),
				String(context.globals['mode'] ?? 'light'),
			);
			return story();
		},
	],
	parameters: {
		// The page is the theme's own background, so the backgrounds addon's grey would only mislead.
		backgrounds: { disable: true },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
