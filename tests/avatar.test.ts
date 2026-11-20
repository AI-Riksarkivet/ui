// @vitest-environment happy-dom
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import AvatarHost from './fixtures/avatar-host.svelte';

let mounted: ReturnType<typeof mount> | null = null;
afterEach(() => {
	if (mounted) unmount(mounted);
	mounted = null;
	document.body.innerHTML = '';
});

describe('Avatar', () => {
	it('names every part it renders with its data-slot, the fallback included', () => {
		mounted = mount(AvatarHost, { target: document.body, props: { initials: 'AL' } });
		flushSync();
		expect(document.querySelector('[data-slot="avatar"]')).not.toBeNull();
		expect(document.querySelector('[data-slot="avatar-fallback"]')?.textContent?.trim()).toBe('AL');
	});
});
