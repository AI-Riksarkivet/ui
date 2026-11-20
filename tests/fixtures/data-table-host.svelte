<script lang="ts">
	// A host for the DataTable component tests: one row per entry, a name column and a column of the
	// controls a row commonly holds (a button, a link, a field), so a test can tell a click or a key on
	// the row from one on a control inside it.
	import {
		DataTable,
		createSvelteTable,
		getCoreRowModel,
		renderSnippet,
		type ColumnDef,
	} from '../../src/lib/components/data-table/index.js';

	type Row = { id: string; name: string };

	let {
		rows,
		onrowclick,
		rowLabel,
	}: { rows: Row[]; onrowclick: (row: Row) => void; rowLabel?: (row: Row) => string } = $props();

	const columns: ColumnDef<Row>[] = [
		{ accessorKey: 'name', header: 'Name' },
		{
			id: 'controls',
			header: 'Controls',
			cell: ({ row }) => renderSnippet(controls, row.original),
		},
	];

	const table = createSvelteTable({
		get data() {
			return rows;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
</script>

{#snippet controls(row: Row)}
	<button type="button">Edit {row.name}</button>
	<a href="#{row.id}">Go to {row.name}</a>
	<input aria-label="Note for {row.name}" />
{/snippet}

<DataTable {table} {onrowclick} {rowLabel} />
