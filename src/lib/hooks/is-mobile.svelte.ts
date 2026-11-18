import { MediaQuery } from 'svelte/reactivity';

/**
 * The width at which an app's frame folds: the sidebar becomes an off-canvas sheet, and a top bar
 * should collapse its links into one overflow menu at the same width. One constant, because the two
 * must flip together: a bar that still lays out horizontally while the sidebar has gone off-canvas
 * runs its links under whatever sits at its right end.
 *
 * 1024 (Tailwind's `lg`) rather than 768, so a top row holding a sidebar, a switcher, a few links and
 * an account control still fits before it folds. The sidebar's own desktop media classes are `lg:`
 * for the same reason: they must agree with this number.
 */
export const SHELL_COLLAPSE_BREAKPOINT = 1024;

const DEFAULT_MOBILE_BREAKPOINT = 768;

export class IsMobile extends MediaQuery {
	constructor(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
		super(`max-width: ${breakpoint - 1}px`);
	}
}
