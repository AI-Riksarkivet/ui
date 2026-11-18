<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Table } from './index.js';

	const { Story } = defineMeta({ title: 'Components/Table', tags: ['autodocs'] });

	const ROWS = [
		{ id: 'r1', name: 'letters', items: 1204, state: 'Ready' },
		{ id: 'r2', name: 'recordings', items: 87, state: 'In review' },
		{ id: 'r3', name: 'maps', items: 15, state: 'Ready' },
	];
</script>

<Story name="Default">
	<Table.Root class="w-[32rem]">
		<Table.Caption>Three collections.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head class="text-right">Items</Table.Head>
				<Table.Head>State</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each ROWS as row (row.id)}
				<Table.Row>
					<Table.Cell>{row.name}</Table.Cell>
					<Table.Cell class="text-right tabular-nums">{row.items}</Table.Cell>
					<Table.Cell>{row.state}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
		<Table.Footer>
			<Table.Row>
				<Table.Cell>Total</Table.Cell>
				<Table.Cell class="text-right tabular-nums">1306</Table.Cell>
				<Table.Cell></Table.Cell>
			</Table.Row>
		</Table.Footer>
	</Table.Root>
</Story>
