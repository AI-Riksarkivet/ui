// @vitest-environment happy-dom
import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Select from '../src/lib/components/select/select.svelte';

let mounted: ReturnType<typeof mount> | null = null;
afterEach(() => {
	if (mounted) unmount(mounted);
	mounted = null;
	document.body.innerHTML = '';
});

describe('Select', () => {
	it('tells assistive technology which options cannot be picked', async () => {
		mounted = mount(Select, {
			target: document.body,
			props: {
				ariaLabel: 'Kind',
				options: [
					{ value: 'a', label: 'Open' },
					{ value: 'b', label: 'Closed', disabled: true },
				],
			},
		});
		flushSync();
		const trigger = document.querySelector<HTMLElement>('[data-slot="select-trigger"]')!;
		trigger.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
		);
		await tick();
		flushSync();
		const option = (label: string) =>
			[...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
				(o) => o.textContent?.trim() === label,
			)!;
		expect(option('Closed').hasAttribute('data-disabled')).toBe(true);
		expect(option('Closed').getAttribute('aria-disabled')).toBe('true');
		expect(option('Open').hasAttribute('aria-disabled')).toBe(false);
	});

	it('names its trigger with its label and the value it shows, so a reader hears both', () => {
		mounted = mount(Select, {
			target: document.body,
			props: { ariaLabel: 'Kind', value: 'a', options: [{ value: 'a', label: 'Open' }] },
		});
		flushSync();
		const trigger = document.querySelector<HTMLElement>('[data-slot="select-trigger"]')!;
		const name = (trigger.getAttribute('aria-labelledby') ?? '')
			.split(' ')
			.map((id) => document.getElementById(id)?.textContent?.trim())
			.join(' ');
		expect(name).toBe('Kind Open');
		// The visible value is inside the name (WCAG 2.5.3), so no aria-label overrides it.
		expect(trigger.hasAttribute('aria-label')).toBe(false);
	});
});
