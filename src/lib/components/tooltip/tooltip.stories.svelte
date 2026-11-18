<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { buttonVariants } from '../button/index.js';
	import * as Tooltip from './index.js';

	const { Story } = defineMeta({ title: 'Components/Tooltip', tags: ['autodocs'] });
</script>

<Story name="Default">
	<div class="p-12">
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger class={buttonVariants({ variant: 'outline' })}
					>Hover or focus me</Tooltip.Trigger
				>
				<Tooltip.Content>The full value, as a tooltip</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
</Story>
