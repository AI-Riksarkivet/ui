<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Skeleton from './skeleton.svelte';

	const { Story } = defineMeta({
		title: 'Components/Skeleton',
		tags: ['autodocs'],
	});
</script>

<Story name="Rows">
	<div class="flex w-80 flex-col gap-2">
		<Skeleton class="h-5 w-2/3" />
		<Skeleton class="h-4 w-full" />
		<Skeleton class="h-4 w-5/6" />
	</div>
</Story>
