<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import RadioGroup from './radio-group.svelte';

	const { Story } = defineMeta({
		title: 'Components/RadioGroup',
		component: RadioGroup,
		tags: ['autodocs'],
		args: {
			value: 'week',
			options: [
				{ value: 'day', label: 'A day' },
				{ value: 'week', label: 'A week', description: 'The default.' },
				{ value: 'month', label: 'A month', description: 'Kept longest.' },
			],
		},
	});
</script>

<Story name="Default" />
