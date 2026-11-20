// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushSync, mount, unmount, type Component } from 'svelte';
import DataTableHost from './fixtures/data-table-host.svelte';
import { mergeObjects } from '../src/lib/components/data-table/create-svelte-table.svelte';
import {
	RenderComponentConfig,
	RenderSnippetConfig,
	renderComponent,
	renderSnippet,
} from '../src/lib/components/data-table/render-helpers';
import { selectionColumn } from '../src/lib/components/data-table/selection-column';

// Pure helpers of the data-table stack (the reactive createSvelteTable itself needs a component
// context and is exercised by a consuming app's browser suite).
describe('mergeObjects', () => {
	it('later sources win and getter semantics are preserved (read on ACCESS, not merged eagerly)', () => {
		let hits = 0;
		const merged = mergeObjects(
			{ a: 1, b: 1 },
			{
				b: 2,
				get c() {
					hits += 1;
					return hits;
				},
			},
		);
		expect(merged.a).toBe(1);
		expect(merged.b).toBe(2);
		expect(hits).toBe(0); // the getter has not run yet
		expect(merged.c).toBe(1);
		expect(merged.c).toBe(2); // re-read → re-evaluated, exactly the reactivity seam tanstack needs
	});

	it('resolves thunk sources lazily and tolerates null-returning thunks', () => {
		const merged = mergeObjects(
			{ a: 1 },
			() => null,
			() => ({ b: 2 }),
		);
		expect(merged.a).toBe(1);
		expect(merged.b).toBe(2);
		expect('b' in merged).toBe(true);
		expect(Object.keys(merged).sort()).toEqual(['a', 'b']);
	});
});

describe('render helpers', () => {
	const FakeComponent = (() => {}) as unknown as Component<{ label: string }>;

	it('renderComponent wraps a component + props in a RenderComponentConfig', () => {
		const cfg = renderComponent(FakeComponent, { label: 'Name' });
		expect(cfg).toBeInstanceOf(RenderComponentConfig);
		expect(cfg.component).toBe(FakeComponent);
		expect(cfg.props).toEqual({ label: 'Name' });
	});

	it('renderSnippet wraps a snippet + params in a RenderSnippetConfig', () => {
		const snippet = (() => {}) as unknown as Parameters<typeof renderSnippet<string>>[0];
		const cfg = renderSnippet(snippet, 'row-1');
		expect(cfg).toBeInstanceOf(RenderSnippetConfig);
		expect(cfg.snippet).toBe(snippet);
		expect(cfg.params).toBe('row-1');
	});
});

describe('selectionColumn', () => {
	it('builds the fixed-width, unsortable select column with header + cell renderers', () => {
		const col = selectionColumn<{ id: string }>();
		expect(col.id).toBe('select');
		expect(col.enableSorting).toBe(false);
		expect(col.enableHiding).toBe(false);
		expect(col.meta?.headerClass).toBe('w-10');
		expect(typeof col.header).toBe('function');
		expect(typeof col.cell).toBe('function');
	});

	it('wires the cell checkbox to the row selection API', () => {
		let toggled: boolean | undefined;
		const row = {
			getIsSelected: () => false,
			toggleSelected: (v: boolean) => {
				toggled = v;
			},
		};
		const col = selectionColumn<{ id: string }>();
		const cfg = (col.cell as (ctx: { row: typeof row }) => RenderComponentConfig<Component>)({
			row,
		});
		expect(cfg).toBeInstanceOf(RenderComponentConfig);
		const props = cfg.props as { checked: boolean; onCheckedChange: (v: boolean) => void };
		expect(props.checked).toBe(false);
		props.onCheckedChange(true);
		expect(toggled).toBe(true);
	});
});

describe('DataTable row activation', () => {
	const rows = [
		{ id: 'a', name: 'Alpha' },
		{ id: 'b', name: 'Beta' },
	];
	let host: ReturnType<typeof mount> | null = null;
	afterEach(() => {
		if (host) unmount(host);
		host = null;
		document.body.innerHTML = '';
	});

	function render(props: { rowLabel?: (row: { id: string; name: string }) => string } = {}) {
		const onrowclick = vi.fn();
		host = mount(DataTableHost, { target: document.body, props: { rows, onrowclick, ...props } });
		flushSync();
		const row = document.querySelectorAll<HTMLTableRowElement>('tbody [data-slot="table-row"]')[0]!;
		const control = (name: string) =>
			[...row.querySelectorAll<HTMLElement>('a, button, input')].find(
				(el) => (el.textContent?.trim() || el.getAttribute('aria-label')) === name,
			)!;
		return { onrowclick, row, control };
	}

	it('keeps the row a table row, and opens it from a real button in its first cell', () => {
		const { onrowclick, row } = render();
		// No role override: the row and its cells stay the table's, so a reader can move through them.
		expect(row.tagName).toBe('TR');
		expect(row.hasAttribute('role')).toBe(false);
		expect(row.hasAttribute('tabindex')).toBe(false);
		expect(row.closest('table')?.hasAttribute('role')).toBe(false);
		expect([...row.children].every((cell) => cell.tagName === 'TD')).toBe(true);

		const open = row.querySelector<HTMLButtonElement>('[data-slot="data-table-row-action"]');
		expect(open?.tagName).toBe('BUTTON');
		expect(open?.type).toBe('button');
		expect(row.cells[0]?.contains(open)).toBe(true);
		expect(open?.textContent?.trim()).toBe('Open Alpha');
		open!.click();
		expect(onrowclick).toHaveBeenCalledExactlyOnceWith(rows[0]);
	});

	it("names the row's button as the app says", () => {
		const { row } = render({ rowLabel: (r) => `Show the details of ${r.name}` });
		expect(row.querySelector('[data-slot="data-table-row-action"]')?.textContent?.trim()).toBe(
			'Show the details of Alpha',
		);
	});

	it('activates the row on a click that lands on the row itself', () => {
		const { onrowclick, row } = render();
		row.cells[0]!.click();
		expect(onrowclick).toHaveBeenCalledExactlyOnceWith(rows[0]);
		row.click();
		expect(onrowclick).toHaveBeenCalledTimes(2);
	});

	it('never activates the row from a click on a control inside it', () => {
		const { onrowclick, control } = render();
		control('Edit Alpha').click();
		control('Note for Alpha').click();
		control('Go to Alpha').click();
		expect(onrowclick).not.toHaveBeenCalled();
	});
});
