<script lang="ts" generics="TData">
	import type { Snippet } from 'svelte';
	import type { Cell, Row, Table } from '@tanstack/table-core';
	import { ChevronLeft, ChevronRight, TriangleAlert } from '@lucide/svelte';
	import * as TablePrimitive from '../table/index.js';
	import { Button } from '../button/index.js';
	import { Skeleton } from '../skeleton/index.js';
	import { cn } from '../../utils/cn.js';
	import FlexRender from './flex-render.svelte';
	import './types.js';

	// The shared table shell around a `createSvelteTable` instance: header/body from the column
	// defs (via FlexRender), explicit loading (skeleton rows) / error / empty states, an optional
	// row-click, a footer snippet (selection counts etc.) and pagination controls that appear only
	// once the data outgrows the smallest page size. Presentation-only — sorting/filtering/selection
	// live in the consumer's table state, so this renders ANY tanstack feature combination.
	let {
		table,
		loading = false,
		error = null,
		emptyMessage = 'No results.',
		onrowclick,
		rowLabel,
		footer,
	}: {
		table: Table<TData>;
		/** True while the first load is in flight — renders skeleton rows instead of the body. */
		loading?: boolean;
		/** A load failure to surface in-table (the row area shows it; header stays for context). */
		error?: string | null;
		emptyMessage?: string;
		/** Opens a row: from its button (keyboard and assistive technology) and from a click anywhere on it. */
		onrowclick?: (row: TData) => void;
		/** The accessible name of a row's button; `Open <the value of its first column>` by default. */
		rowLabel?: (row: TData) => string;
		footer?: Snippet;
	} = $props();

	const PAGE_SIZES = [10, 25, 50, 100];

	const columnCount = $derived(table.getAllColumns().length);
	const pageCount = $derived(table.getPageCount());
	const pageIndex = $derived(table.getState().pagination.pageIndex);
	const pageSize = $derived(String(table.getState().pagination.pageSize));
	const totalRows = $derived(table.getCoreRowModel().rows.length);
	// Shown once there is a second page (a page the server cuts counts its own pages) or the rows outgrow the smallest size.
	const showPagination = $derived(pageCount > 1 || totalRows > (PAGE_SIZES[0] ?? 10));

	/** What owns its own click inside a row: a click landing on one is that control's, never the row's. */
	const ROW_CONTROLS = 'a, button, input, select, textarea, label, summary';

	/** Whether a row's click landed on a control inside it. The control itself never stops the click: a
	 *  client-side router reads a link's click where it bubbles to, and a stopped one is left to the
	 *  browser, which loads the page whole. */
	function landedOnAControl(e: MouseEvent): boolean {
		const row = e.currentTarget;
		const control = e.target instanceof Element ? e.target.closest(ROW_CONTROLS) : null;
		return control !== null && row instanceof Element && control !== row && row.contains(control);
	}

	/** The cell a row's button goes in: the first one that is not the selection column's checkbox. */
	function primaryCell(row: Row<TData>): Cell<TData, unknown> | undefined {
		return row.getVisibleCells().find((cell) => cell.column.id !== 'select');
	}

	function labelOf(row: Row<TData>): string {
		if (rowLabel) return rowLabel(row.original);
		const value = primaryCell(row)?.getValue();
		const text = value === null || value === undefined ? '' : String(value).trim();
		return text ? `Open ${text}` : `Open row ${row.index + 1}`;
	}
</script>

<!-- The table CARD owns containment: `min-w-0` + `max-w-full` so a wide table can never push the
     page (and with it the document) past the viewport, and `overflow-hidden` so the rounded border
     clips cleanly. The horizontal scroll itself belongs to the inner `table-container` the Table
     primitive already provides — the wide table scrolls INSIDE this card instead of slicing the
     card off the right edge of the screen. -->
<div
	data-slot="data-table-card"
	class="bg-card w-full max-w-full min-w-0 overflow-hidden rounded-none"
>
	<TablePrimitive.Root>
		<TablePrimitive.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<TablePrimitive.Row class="hover:bg-transparent">
					{#each headerGroup.headers as header (header.id)}
						<TablePrimitive.Head
							class={cn(
								'text-muted-foreground px-3 py-2 font-medium',
								header.column.columnDef.meta?.headerClass,
							)}
						>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</TablePrimitive.Head>
					{/each}
				</TablePrimitive.Row>
			{/each}
		</TablePrimitive.Header>
		<TablePrimitive.Body>
			{#if loading}
				{#each [0, 1, 2, 3, 4] as i (i)}
					<TablePrimitive.Row>
						<TablePrimitive.Cell colspan={columnCount} class="px-3 py-2.5">
							<Skeleton class="h-4 w-full" />
						</TablePrimitive.Cell>
					</TablePrimitive.Row>
				{/each}
			{:else if error !== null}
				<TablePrimitive.Row>
					<TablePrimitive.Cell
						colspan={columnCount}
						class="px-3 py-8 text-center break-words whitespace-normal"
					>
						<div class="text-destructive inline-flex items-center gap-2 text-sm">
							<TriangleAlert class="size-4 shrink-0" />
							{error}
						</div>
					</TablePrimitive.Cell>
				</TablePrimitive.Row>
			{:else}
				{#each table.getRowModel().rows as row (row.id)}
					<TablePrimitive.Row
						data-state={row.getIsSelected() ? 'selected' : undefined}
						class={cn(
							onrowclick &&
								'cursor-pointer has-[[data-slot=data-table-row-action]:focus-visible]:outline-ring has-[[data-slot=data-table-row-action]:focus-visible]:outline-2 has-[[data-slot=data-table-row-action]:focus-visible]:-outline-offset-2',
						)}
						onclick={onrowclick
							? (e: MouseEvent) => {
									if (!landedOnAControl(e)) onrowclick(row.original);
								}
							: undefined}
					>
						{@const action = onrowclick ? primaryCell(row)?.id : undefined}
						{#each row.getVisibleCells() as cell (cell.id)}
							<TablePrimitive.Cell class={cn('px-3 py-2', cell.column.columnDef.meta?.cellClass)}>
								{#if onrowclick && cell.id === action}
									<!-- The row's own control: what a keyboard and a screen reader open the row with, beside
									     the cell's content rather than around it, so it never nests a control the cell holds.
									     Hidden from sight; its focus is drawn around the whole row. -->
									<button
										type="button"
										data-slot="data-table-row-action"
										class="sr-only"
										onclick={() => onrowclick(row.original)}>{labelOf(row)}</button
									>
								{/if}
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</TablePrimitive.Cell>
						{/each}
					</TablePrimitive.Row>
				{:else}
					<TablePrimitive.Row>
						<!-- `whitespace-normal`: the Cell primitive is nowrap by default (right for data
						     cells, wrong for a sentence) — without it a long empty-state message widens the
						     table past its card and reads as text sliced mid-word. -->
						<TablePrimitive.Cell
							colspan={columnCount}
							class="text-muted-foreground px-3 py-8 text-center break-words whitespace-normal"
						>
							{emptyMessage}
						</TablePrimitive.Cell>
					</TablePrimitive.Row>
				{/each}
			{/if}
		</TablePrimitive.Body>
	</TablePrimitive.Root>
</div>

{#if footer || showPagination}
	<!-- Wraps rather than overflows: on a narrow viewport the footer counts and the pagination
	     controls stack instead of pushing the page sideways. -->
	<div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2">
		<div class="text-muted-foreground flex min-w-0 items-center gap-4 text-sm">
			{#if footer}
				{@render footer()}
			{/if}
		</div>
		{#if showPagination}
			<div class="ml-auto flex items-center gap-3">
				<label class="text-muted-foreground flex items-center gap-1.5 text-xs">
					Rows
					<select
						class="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-7 rounded-lg border px-2 py-0.5 text-xs transition-colors outline-none focus-visible:ring-3"
						value={pageSize}
						onchange={(e) => table.setPageSize(Number(e.currentTarget.value))}
					>
						{#each PAGE_SIZES as size (size)}
							<option value={String(size)}>{size}</option>
						{/each}
					</select>
				</label>
				<span class="text-muted-foreground text-xs tabular-nums">
					Page {pageIndex + 1} of {Math.max(pageCount, 1)}
				</span>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Previous page"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeft class="size-4" />
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Next page"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<ChevronRight class="size-4" />
				</Button>
			</div>
		{/if}
	</div>
{/if}
