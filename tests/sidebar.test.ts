// @vitest-environment happy-dom
import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IsMobile, SHELL_COLLAPSE_BREAKPOINT } from '../src/lib/components/sidebar/index.js';
import SidebarHost from './fixtures/sidebar-host.svelte';

// Below the width at which the sidebar folds into a sheet.
const PHONE = 390;

/** happy-dom's own control of the window's width, which the media queries read. */
const setWidth = (px: number) =>
	(
		window as unknown as { happyDOM: { setInnerWidth(width: number): void } }
	).happyDOM.setInnerWidth(px);

let mounted: ReturnType<typeof mount> | null = null;
let width = 0;
beforeEach(() => {
	width = window.innerWidth;
	setWidth(PHONE);
});
afterEach(() => {
	if (mounted) unmount(mounted);
	mounted = null;
	document.body.innerHTML = '';
	setWidth(width);
});

const settle = async () => {
	flushSync();
	await tick();
	await new Promise((done) => setTimeout(done, 20));
	flushSync();
};
const sheet = () =>
	document.querySelector<HTMLElement>('[data-sidebar="sidebar"][data-mobile="true"]');

async function openSheet(props: { mobileTitle?: string; mobileDescription?: string } = {}) {
	mounted = mount(SidebarHost, { target: document.body, props });
	await settle();
	// A pointer press focuses the trigger before its click, which happy-dom's click() does not do.
	const trigger = document.querySelector<HTMLElement>('[data-sidebar="trigger"]')!;
	trigger.focus();
	trigger.click();
	await settle();
	expect(sheet()).not.toBeNull();
	return sheet()!;
}

describe('Sidebar at phone width', () => {
	it('names its sheet with the title it is given, and a neutral one when it is given none', async () => {
		const named = await openSheet({ mobileTitle: 'Pages', mobileDescription: 'Every page.' });
		expect(named.getAttribute('role')).toBe('dialog');
		const title = () => document.getElementById(sheet()!.getAttribute('aria-labelledby') ?? '');
		const description = () =>
			document.getElementById(sheet()!.getAttribute('aria-describedby') ?? '');
		expect(title()?.textContent).toBe('Pages');
		expect(description()?.textContent).toBe('Every page.');
		unmount(mounted!);
		mounted = null;
		await openSheet();
		expect(title()?.textContent).toBe('Navigation');
	});

	it('puts focus on its first row when it opens, and gives it back to the trigger when it closes', async () => {
		const open = await openSheet();
		expect(document.activeElement?.getAttribute('data-sidebar')).toBe('menu-button');
		expect(document.activeElement?.textContent?.trim()).toBe('Tables');
		expect(open.contains(document.activeElement)).toBe(true);
		document.activeElement!.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
		);
		await settle();
		expect(sheet()).toBeNull();
		expect(document.activeElement?.getAttribute('data-sidebar')).toBe('trigger');
	});

	it('closes from the close button in its header', async () => {
		const open = await openSheet();
		const close = [...open.querySelectorAll<HTMLButtonElement>('button')].find(
			(b) => b.textContent?.trim() === 'Close',
		);
		expect(close?.closest('[data-slot="sheet-header"]')).not.toBeNull();
		close!.click();
		await settle();
		expect(sheet()).toBeNull();
	});

	it('closes on Escape from one of its rows, which carries no tooltip there', async () => {
		const open = await openSheet();
		const row = open.querySelector<HTMLElement>('[data-sidebar="menu-button"]')!;
		row.focus();
		await settle();
		row.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
		);
		await settle();
		expect(sheet()).toBeNull();
	});
});

describe('the width the sidebar folds at', () => {
	it("is where the rail becomes a sheet, and what an app's top bar folds at by default", async () => {
		for (const [px, folded] of [
			[SHELL_COLLAPSE_BREAKPOINT - 1, true],
			[SHELL_COLLAPSE_BREAKPOINT, false],
		] as const) {
			setWidth(px);
			// An app's top bar asks the same question with no argument, and gets the sidebar's answer.
			expect(new IsMobile().current).toBe(folded);
			expect(new IsMobile(SHELL_COLLAPSE_BREAKPOINT).current).toBe(folded);

			mounted = mount(SidebarHost, { target: document.body, props: {} });
			await settle();
			const rail = () =>
				document.querySelector('[data-slot="sidebar"][data-state]:not([data-mobile])');
			// Below the width there is no rail in the page; above it, the rail is laid out and expanded.
			expect(rail()?.getAttribute('data-state') ?? null).toBe(folded ? null : 'expanded');
			document.querySelector<HTMLElement>('[data-sidebar="trigger"]')!.click();
			await settle();
			// The trigger opens the sheet below the width, and collapses the rail above it.
			expect(sheet() !== null).toBe(folded);
			expect(rail()?.getAttribute('data-state') ?? null).toBe(folded ? null : 'collapsed');
			unmount(mounted);
			mounted = null;
			document.body.innerHTML = '';
		}
	});
});
