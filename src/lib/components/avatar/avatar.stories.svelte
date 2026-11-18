<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import * as Avatar from './index.js';

	const { Story } = defineMeta({ title: 'Components/Avatar', tags: ['autodocs'] });
</script>

<Story name="Fallback initials">
	<div class="flex gap-3">
		<Avatar.Root>
			<Avatar.Fallback>AL</Avatar.Fallback>
		</Avatar.Root>
		<Avatar.Root class="size-12">
			<Avatar.Fallback>MS</Avatar.Fallback>
		</Avatar.Root>
	</div>
</Story>
