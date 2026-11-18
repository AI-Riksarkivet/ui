<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Switch from './switch.svelte';

	const { Story } = defineMeta({
		title: 'Components/Switch',
		component: Switch,
		tags: ['autodocs'],
		args: { 'aria-label': 'Notify me' },
	});
</script>

<Story name="Off" />

<Story name="On" args={{ checked: true }} />

<Story name="Disabled" args={{ disabled: true }} />
