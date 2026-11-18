<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Separator from './separator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Separator',
		tags: ['autodocs'],
	});
</script>

<Story name="Both orientations">
	<div class="flex w-80 flex-col gap-3 text-sm">
		<span>Above</span>
		<Separator />
		<div class="flex h-5 items-center gap-3">
			<span>Left</span>
			<Separator orientation="vertical" />
			<span>Right</span>
		</div>
	</div>
</Story>
