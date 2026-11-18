<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { buttonVariants } from '../button/index.js';
	import * as Sheet from './index.js';

	const { Story } = defineMeta({ title: 'Components/Sheet', tags: ['autodocs'] });

	const SIDES = ['right', 'left', 'top', 'bottom'] as const;
</script>

<Story name="Every side">
	<div class="flex gap-2">
		{#each SIDES as side (side)}
			<Sheet.Root>
				<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>{side}</Sheet.Trigger>
				<Sheet.Content {side}>
					<Sheet.Header>
						<Sheet.Title>A sheet from the {side}</Sheet.Title>
						<Sheet.Description
							>It slides in on the drawer easing and dims the page with the scrim.</Sheet.Description
						>
					</Sheet.Header>
					<Sheet.Footer>
						<Sheet.Close class={buttonVariants({ variant: 'secondary' })}>Close</Sheet.Close>
					</Sheet.Footer>
				</Sheet.Content>
			</Sheet.Root>
		{/each}
	</div>
</Story>
