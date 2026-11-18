<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Select from './select.svelte';

	const { Story } = defineMeta({
		title: 'Components/Select',
		component: Select,
		tags: ['autodocs'],
		args: {
			ariaLabel: 'Sort by',
			placeholder: 'Sort by…',
			options: [
				{ value: 'name', label: 'Name' },
				{ value: 'created', label: 'Created' },
				{ value: 'size', label: 'Size' },
				{ value: 'owner', label: 'Owner', disabled: true },
			],
		},
	});
</script>

<Story name="Placeholder" />

<Story name="Chosen" args={{ value: 'created' }} />

<Story name="Disabled" args={{ disabled: true, value: 'name' }} />
