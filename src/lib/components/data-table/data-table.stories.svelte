<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DataTable from './data-table.svelte';

	const { Story } = defineMeta({ title: 'Components/DataTable', tags: ['autodocs'] });

	export type Item = { id: string; name: string; items: number };
</script>

<script lang="ts">
	import {
		createSvelteTable,
		DataTableRowActions,
		DataTableTextFilter,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		renderSnippet,
		selectionColumn,
		sortableHeader,
		type ColumnDef,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
	} from './index.js';
	import * as DropdownMenu from '../dropdown-menu/index.js';

	const DATA: Item[] = Array.from({ length: 34 }, (_, i) => ({
		id: `c${i + 1}`,
		name: `collection-${String(i + 1).padStart(2, '0')}`,
		items: (i * 37) % 500,
	}));

	let sorting = $state<SortingState>([]);
	let globalFilter = $state('');
	let rowSelection = $state<RowSelectionState>({});
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

	const columns: ColumnDef<Item>[] = [
		selectionColumn<Item>(),
		{ accessorKey: 'name', header: sortableHeader('Name') },
		{ accessorKey: 'items', header: sortableHeader('Items') },
		{ id: 'actions', cell: ({ row }) => renderSnippet(actions, row.original) },
	];

	const table = createSvelteTable({
		get data() {
			return DATA;
		},
		columns,
		getRowId: (row) => row.id,
		state: {
			get sorting() {
				return sorting;
			},
			get globalFilter() {
				return globalFilter;
			},
			get rowSelection() {
				return rowSelection;
			},
			get pagination() {
				return pagination;
			},
		},
		onSortingChange: (u) => (sorting = typeof u === 'function' ? u(sorting) : u),
		onRowSelectionChange: (u) => (rowSelection = typeof u === 'function' ? u(rowSelection) : u),
		onPaginationChange: (u) => (pagination = typeof u === 'function' ? u(pagination) : u),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const empty = createSvelteTable<Item>({ data: [], columns, getCoreRowModel: getCoreRowModel() });

	// A row that opens, holding controls of its own: a click or a key on a control is the control's,
	// and only a click on the row, or Enter or Space with the row focused, opens it.
	let opened = $state('nothing yet');
	const openable = createSvelteTable<Item>({
		data: DATA.slice(0, 4),
		columns: [
			{ accessorKey: 'name', header: 'Name' },
			{
				id: 'controls',
				header: 'Controls',
				cell: ({ row }) => renderSnippet(controls, row.original),
			},
		],
		getCoreRowModel: getCoreRowModel(),
	});
</script>

{#snippet actions(item: Item)}
	<DataTableRowActions label={`Actions for ${item.name}`}>
		<DropdownMenu.Item>Open</DropdownMenu.Item>
		<DropdownMenu.Item>Copy the id</DropdownMenu.Item>
	</DataTableRowActions>
{/snippet}

{#snippet controls(item: Item)}
	<div class="flex items-center gap-3">
		<a class="text-primary underline-offset-4 hover:underline" href={`#${item.id}`}>Link</a>
		<button
			type="button"
			class="text-primary underline-offset-4 hover:underline"
			onclick={() => (opened = `the button of ${item.name}`)}>Button</button
		>
	</div>
{/snippet}

<Story name="Rows that open, with controls inside">
	<div class="flex w-[40rem] flex-col gap-3">
		<DataTable table={openable} onrowclick={(item) => (opened = `the row ${item.name}`)} />
		<p class="text-muted-foreground text-sm" aria-live="polite">Opened: {opened}</p>
	</div>
</Story>

<Story name="Sort, filter, select, page">
	<div class="flex w-[40rem] flex-col gap-3">
		<DataTableTextFilter bind:value={globalFilter} placeholder="Filter by name…" />
		<DataTable {table} onrowclick={() => undefined} />
	</div>
</Story>

<Story name="Loading">
	<div class="w-[40rem]"><DataTable table={empty} loading /></div>
</Story>

<Story name="Empty">
	<div class="w-[40rem]"><DataTable table={empty} emptyMessage="No collections yet." /></div>
</Story>

<Story name="Failed">
	<div class="w-[40rem]">
		<DataTable table={empty} error="The list could not be read: try again." />
	</div>
</Story>
