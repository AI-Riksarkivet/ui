<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Slider from './slider.svelte';

	const { Story } = defineMeta({
		title: 'Components/Slider',
		component: Slider,
		tags: ['autodocs'],
		args: { value: 40, min: 0, max: 100, step: 1, 'aria-label': 'Volume', class: 'w-72' },
	});
</script>

<Story name="Default" />

<Story name="Disabled" args={{ disabled: true }} />
