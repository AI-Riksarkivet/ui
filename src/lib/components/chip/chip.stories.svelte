<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Chip from './chip.svelte';

	const { Story } = defineMeta({
		title: 'Components/Chip',
		component: Chip,
		tags: ['autodocs'],
		args: { label: 'matched in title', tone: 'neutral' },
		argTypes: { tone: { control: 'select', options: ['neutral', 'accent'] } },
	});
</script>

<Story name="Neutral" />

<Story name="Accent" args={{ tone: 'accent', label: 'exact match' }} />
