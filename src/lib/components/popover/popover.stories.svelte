<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { buttonVariants } from '../button/index.js';
	import * as Popover from './index.js';

	const { Story } = defineMeta({ title: 'Components/Popover', tags: ['autodocs'] });
</script>

<Story name="Default">
	<Popover.Root>
		<Popover.Trigger class={buttonVariants({ variant: 'outline' })}>Filters</Popover.Trigger>
		<Popover.Content class="w-72">
			<p class="text-sm">Whatever floats takes the one elevated shadow and the popover surface.</p>
		</Popover.Content>
	</Popover.Root>
</Story>
