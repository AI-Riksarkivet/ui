<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { buttonVariants } from '../button/index.js';
	import * as DropdownMenu from './index.js';

	const { Story } = defineMeta({ title: 'Components/DropdownMenu', tags: ['autodocs'] });
</script>

<script lang="ts">
	let density = $state('comfortable');
</script>

<Story name="Items, a label and a radio group">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}
			>Options</DropdownMenu.Trigger
		>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Label>Row</DropdownMenu.Label>
			<DropdownMenu.Item>Open</DropdownMenu.Item>
			<DropdownMenu.Item>Copy the id</DropdownMenu.Item>
			<DropdownMenu.Item disabled>Move (no permission)</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Label>Density</DropdownMenu.Label>
			<DropdownMenu.RadioGroup bind:value={density}>
				<DropdownMenu.RadioItem value="comfortable">Comfortable</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Story>
