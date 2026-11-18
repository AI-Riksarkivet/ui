import type { Plugin } from 'vite';
import type { AppearanceOptions } from '../src/lib/appearance/core.js';

export type UiOptions = AppearanceOptions & {
	/** The boot script's file name at the root of the build, and its path on the dev server. Default `appearance-boot.js`. */
	fileName?: string;
};

/**
 * The package's Vite plugins: its sources left out of dependency pre-bundling, and `/appearance-boot.js`, which puts
 * the kept appearance on <html> before the first paint. Pass it the same `storageKey` and `defaults` the app passes to
 * `appearance.start()`.
 */
export declare function riksarkivetUi(options?: UiOptions): Plugin[];
