<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Badge from './badge.svelte';

	const { Story } = defineMeta({
		title: 'Components/Badge',
		tags: ['autodocs'],
	});

	const VARIANTS = [
		'default',
		'secondary',
		'destructive',
		'outline',
		'success',
		'warning',
	] as const;
</script>

<Story name="Every variant">
	<div class="flex flex-wrap gap-2">
		{#each VARIANTS as variant (variant)}
			<Badge {variant}>{variant}</Badge>
		{/each}
	</div>
</Story>

<Story name="As a link">
	<Badge href="#badge" variant="secondary">A badge that links</Badge>
</Story>
