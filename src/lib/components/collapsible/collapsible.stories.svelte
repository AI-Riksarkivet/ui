<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { ChevronDown } from '@lucide/svelte';
	import * as Collapsible from './index.js';

	const { Story } = defineMeta({ title: 'Components/Collapsible', tags: ['autodocs'] });
</script>

<Story name="Default">
	<Collapsible.Root class="bg-card w-80 p-3">
		<Collapsible.Trigger class="flex w-full items-center justify-between text-sm">
			Details <ChevronDown class="size-4" />
		</Collapsible.Trigger>
		<Collapsible.Content class="text-muted-foreground pt-2 text-sm">
			What the section holds, shown when it is opened.
		</Collapsible.Content>
	</Collapsible.Root>
</Story>
