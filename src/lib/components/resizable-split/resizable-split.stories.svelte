<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ResizableSplit from './resizable-split.svelte';

	const { Story } = defineMeta({
		title: 'Components/ResizableSplit',
		tags: ['autodocs'],
	});
</script>

{#snippet pane(label: string, surface: string)}
	<div class={['text-muted-foreground flex h-full items-center justify-center text-sm', surface]}>
		{label}
	</div>
{/snippet}

<Story name="Horizontal">
	<div class="h-72 w-[40rem]">
		<ResizableSplit storageKey="story-split-h" minLeft={160} minRight={160}>
			{#snippet left()}{@render pane('First pane', 'bg-card')}{/snippet}
			{#snippet right()}{@render pane('Second pane', 'bg-muted')}{/snippet}
		</ResizableSplit>
	</div>
</Story>

<Story name="Vertical">
	<div class="h-96 w-[32rem]">
		<ResizableSplit storageKey="story-split-v" orientation="vertical" minLeft={80} minRight={80}>
			{#snippet left()}{@render pane('Top pane', 'bg-card')}{/snippet}
			{#snippet right()}{@render pane('Bottom pane', 'bg-muted')}{/snippet}
		</ResizableSplit>
	</div>
</Story>
