/**
 * The ONE definition of a kept appearance, shared by the store (`appearance.svelte.ts`) and the boot script the
 * package's Vite plugin (`@riksarkivet/ui/vite`) builds from `bootAppearance` below, so the two can never read a record
 * differently. It imports nothing, so the boot script is this file and a few lines.
 *
 * A record is `{ v: 2, theme, mode, accent }`: a shipped theme's id, a mode, and the accent as one strict `#rrggbb` or
 * null. Nothing else is read from it: the custom properties a colour amounts to are derived from it on the page, never
 * stored, so a tampered or older record can set no token. A record that is anything else is read field by field (an
 * unknown field falls back to the consumer's default) and written back clean.
 *
 * Where the record is kept and what a first visit gets are the consuming app's: it names them once
 * (`AppearanceOptions`) and passes the same object to the Vite plugin and to `appearance.start()`.
 */
export const THEMES = [
	{ id: 'ink', label: 'Ink', description: 'Neutral greys, a blue-violet accent' },
	{ id: 'fjord', label: 'Fjord', description: 'Cool blue-grey, a sea-glass teal' },
	{ id: 'paper', label: 'Paper', description: 'Warm paper, a sealing-wax red' },
	{ id: 'moss', label: 'Moss', description: 'Green-grey, a forest green' },
	{ id: 'contrast', label: 'Contrast', description: 'Black and white, 7:1 text' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];
export type Mode = 'light' | 'dark' | 'system';

export type Appearance = {
	theme: ThemeId;
	mode: Mode;
	/** A chosen accent as `#rrggbb`, or null for the theme's own. */
	accent: string | null;
};

/** What a first visit gets when the consumer names nothing else: the default theme, following the system's mode. */
export const DEFAULT_APPEARANCE: Appearance = { theme: 'ink', mode: 'system', accent: null };
/** The localStorage key when the consumer names none. A consumer should name its own, so two apps on one origin do not
 *  share a choice by accident. */
export const DEFAULT_STORAGE_KEY = 'appearance';

/** What a consuming app decides about the kept appearance. Pass the same object to the Vite plugin and to
 *  `appearance.start()`. */
export type AppearanceOptions = {
	/** The localStorage key the choice is kept under. */
	storageKey?: string;
	/** The theme and mode a first visit (or an unreadable field) gets. A first visit always has the theme's own accent. */
	defaults?: Partial<Pick<Appearance, 'theme' | 'mode'>>;
};

/** The options with every field filled; a default that is not a shipped theme or a mode is dropped. */
export type AppearanceConfig = { storageKey: string; defaults: Appearance };

const MODES: readonly string[] = ['light', 'dark', 'system'];
const isTheme = (v: unknown): v is ThemeId => THEMES.some((t) => t.id === v);
const isMode = (v: unknown): v is Mode => typeof v === 'string' && MODES.includes(v);
/** Strictly `#rrggbb`, lower case: the one shape an accent is kept in. */
export const isAccent = (v: unknown): v is string =>
	typeof v === 'string' && /^#[0-9a-f]{6}$/.test(v);

/** The options a consumer passed, with every field filled and every default checked. */
export function resolveOptions(options: AppearanceOptions = {}): AppearanceConfig {
	const d = options.defaults ?? {};
	const key = options.storageKey;
	return {
		storageKey: typeof key === 'string' && key.length > 0 ? key : DEFAULT_STORAGE_KEY,
		defaults: {
			theme: isTheme(d.theme) ? d.theme : DEFAULT_APPEARANCE.theme,
			mode: isMode(d.mode) ? d.mode : DEFAULT_APPEARANCE.mode,
			accent: null,
		},
	};
}

/** A kept record read tolerantly: each field it cannot use falls back to the given default. */
export function readAppearance(
	raw: string | null,
	defaults: Appearance = DEFAULT_APPEARANCE,
): Appearance {
	let value: unknown = null;
	try {
		value = raw === null ? null : JSON.parse(raw);
	} catch {
		value = null;
	}
	const record =
		typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
	return {
		theme: isTheme(record['theme']) ? record['theme'] : defaults.theme,
		mode: isMode(record['mode']) ? record['mode'] : defaults.mode,
		accent: isAccent(record['accent']) ? record['accent'] : null,
	};
}

/** The record kept for a choice: its fields, and nothing else. */
export const writeAppearance = (choice: Appearance): string =>
	JSON.stringify({ v: 2, theme: choice.theme, mode: choice.mode, accent: choice.accent });

export const isDark = (mode: Mode, systemDark: boolean): boolean =>
	mode === 'dark' || (mode === 'system' && systemDark);

/** Puts a choice's mode and theme on the root element. The accent is the store's to derive, on the page. */
export function applyMode(root: HTMLElement, choice: Appearance, systemDark: boolean): void {
	const dark = isDark(choice.mode, systemDark);
	root.classList.toggle('dark', dark);
	root.style.colorScheme = dark ? 'dark' : 'light';
	root.dataset['theme'] = choice.theme;
}

/** What the browser keeps, read and written best-effort: a browser that refuses storage still gets the default. */
export type Kept = { read: () => string | null; write: (value: string) => void };

/** Reads the kept choice, rewrites it clean when it was not, and returns it. */
export function keptAppearance(kept: Kept, defaults: Appearance = DEFAULT_APPEARANCE): Appearance {
	const raw = kept.read();
	const choice = readAppearance(raw, defaults);
	const clean = writeAppearance(choice);
	if (raw !== null && raw !== clean) kept.write(clean);
	return choice;
}

/** `localStorage` under the given key, every access guarded. */
export const browserKept = (storageKey: string): Kept => ({
	read: () => {
		try {
			return localStorage.getItem(storageKey);
		} catch {
			return null;
		}
	},
	write: (value) => {
		try {
			localStorage.setItem(storageKey, value);
		} catch {
			// Kept for this visit only.
		}
	},
});

/**
 * The boot script's whole job: the kept appearance's mode and theme on <html> before the first paint, so the page never
 * flashes another theme. The Vite plugin builds a call to this, with the consumer's options inlined as JSON, into one
 * classic same-origin script (`appearance-boot.js`) that the strict CSP admits with no hash. The accent needs the
 * page's stylesheets to be derived against, so the store sets it when the app starts, before the app draws anything
 * that shows it.
 */
export function bootAppearance(options: AppearanceOptions = {}): void {
	const config = resolveOptions(options);
	applyMode(
		document.documentElement,
		keptAppearance(browserKept(config.storageKey), config.defaults),
		matchMedia('(prefers-color-scheme: dark)').matches,
	);
}
